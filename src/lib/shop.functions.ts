import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { computeDiscount } from "./pricing";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  status: string;
  bulk_available: boolean;
  variants: { id: string; label: string; price_ngn: number; in_stock: boolean }[];
};

const SELECT =
  "id, slug, name, category, short_description, description, image_url, status, bulk_available, product_variants(id, label, price_ngn, in_stock, sort_order)";

function mapProduct(p: any): ShopProduct {
  const variants = [...(p.product_variants ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const { product_variants, ...rest } = p;
  return { ...rest, variants: variants.map(({ sort_order, ...v }: any) => v) };
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(SELECT)
    .neq("status", "hidden")
    .order("sort_order");
  if (error) {
    console.error(error);
    return [] as ShopProduct[];
  }
  return (data ?? []).map(mapProduct);
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { data: p, error } = await publicClient()
      .from("products")
      .select(SELECT)
      .eq("slug", data.slug)
      .neq("status", "hidden")
      .maybeSingle();
    if (error) console.error(error);
    return p ? mapProduct(p) : null;
  });

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  delivery_address: z.string().trim().min(5).max(500),
  state: z.string().trim().min(2).max(60),
  notes: z.string().trim().max(1000).optional(),
  items: z
    .array(z.object({ variant_id: z.string().uuid(), quantity: z.number().int().min(1).max(500) }))
    .min(1)
    .max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Optional signed-in owner, derived from the bearer token only
    let userId: string | null = null;
    const auth = getRequestHeader("authorization");
    if (auth?.startsWith("Bearer ")) {
      const { data: u } = await supabaseAdmin.auth.getUser(auth.slice(7));
      userId = u.user?.id ?? null;
    }

    const ids = data.items.map((i) => i.variant_id);
    const { data: variants, error } = await supabaseAdmin
      .from("product_variants")
      .select("id, label, price_ngn, in_stock, product_id, products(name, status)")
      .in("id", ids);
    if (error) throw new Error("Could not load products");

    const lines = data.items.map((i) => {
      const v: any = variants?.find((x) => x.id === i.variant_id);
      if (!v || !v.in_stock || v.products?.status !== "available")
        throw new Error("One of the items is no longer available");
      return {
        product_id: v.product_id,
        variant_id: v.id,
        product_name: v.products.name,
        variant_label: v.label,
        unit_price_ngn: v.price_ngn,
        quantity: i.quantity,
        line_total_ngn: v.price_ngn * i.quantity,
      };
    });
    const subtotal = lines.reduce((s, l) => s + l.line_total_ngn, 0);
    const { discount, consultation } = computeDiscount(subtotal);

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: data.customer_name,
        phone: data.phone,
        email: data.email || null,
        delivery_address: data.delivery_address,
        state: data.state,
        notes: data.notes || null,
        subtotal_ngn: subtotal,
        discount_ngn: discount,
        total_ngn: subtotal - discount,
        health_consultation: consultation,
        gift_meal_guide: true,
      })
      .select("id, order_number, total_ngn")
      .single();
    if (oErr || !order) {
      console.error(oErr);
      throw new Error("Could not place order");
    }
    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (iErr) console.error(iErr);
    const { error: sErr } = await supabaseAdmin
      .from("stock_movements")
      .insert(lines.map((l) => ({ variant_id: l.variant_id, change: -l.quantity, reason: "sale", note: order.order_number })));
    if (sErr) console.error(sErr);

    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const items = lines.map((l) => ({ name: l.product_name, label: l.variant_label, quantity: l.quantity, total: l.line_total_ngn }));
      const common = { orderNumber: order.order_number, items, total: order.total_ngn, address: `${data.delivery_address}, ${data.state}` };
      await sendTemplateEmail("new-order-alert", "fruitvegfarm@gmail.com", {
        templateData: { ...common, name: data.customer_name, phone: data.phone, email: data.email || undefined, notes: data.notes },
        idempotencyKey: `new-order-alert-${order.id}`,
        replyTo: data.email || undefined,
      });
      if (data.email) {
        await sendTemplateEmail("order-confirmation", data.email, {
          templateData: { ...common, name: data.customer_name, subtotal, discount, consultation },
          idempotencyKey: `order-confirmation-${order.id}`,
          replyTo: "fruitvegfarm@gmail.com",
        });
      }
    } catch (e) {
      console.error("Order email failed", e);
    }

    return { order_number: order.order_number, total: order.total_ngn, consultation };
  });
