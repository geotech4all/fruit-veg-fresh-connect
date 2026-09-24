import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { computeDiscount, formatNaira } from "@/lib/pricing";
import { createOrder } from "@/lib/shop.functions";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Order — Fruit&Veg" },
      { name: "description", content: "Review your order and checkout. Free delivery nationwide, pay on delivery." },
      { property: "og:title", content: "Your Order — Fruit&Veg" },
      { property: "og:description", content: "Checkout with free delivery and payment on delivery." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function CartPage() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const place = useServerFn(createOrder);
  const [busy, setBusy] = useState(false);
  const { discount, consultation } = computeDiscount(cart.subtotal);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await place({
        data: {
          customer_name: String(f.get("name") ?? ""),
          phone: String(f.get("phone") ?? ""),
          email: String(f.get("email") ?? ""),
          delivery_address: String(f.get("address") ?? ""),
          state: String(f.get("state") ?? ""),
          notes: String(f.get("notes") ?? ""),
          items: cart.items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
        },
      });
      cart.clear();
      navigate({ to: "/order-confirmed", search: { n: res.order_number, t: res.total, c: res.consultation ? 1 : 0 } });
    } catch (err) {
      toast.error(err instanceof Error && err.message.length < 120 ? err.message : "Please check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (cart.items.length === 0)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-28 text-center">
          <h1 className="font-serif text-4xl">Your order is empty</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Browse products</Link>
        </div>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-8 lg:grid-cols-[1fr_420px]">
        <div>
          <h1 className="font-serif text-4xl">Your order</h1>
          <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
            {cart.items.map((i) => (
              <li key={i.variant_id} className="flex flex-wrap items-center gap-4 p-5">
                <div className="flex-1">
                  <p className="font-semibold">{i.product_name}</p>
                  <p className="text-sm text-muted-foreground">{i.label} · {formatNaira(i.price)}</p>
                </div>
                <div className="flex items-center rounded-full border border-border">
                  <button aria-label="Less" className="p-2.5" onClick={() => cart.setQty(i.variant_id, i.quantity - 1)}><Minus size={12} /></button>
                  <span className="w-7 text-center text-sm font-semibold">{i.quantity}</span>
                  <button aria-label="More" className="p-2.5" onClick={() => cart.setQty(i.variant_id, i.quantity + 1)}><Plus size={12} /></button>
                </div>
                <span className="w-28 text-right font-semibold">{formatNaira(i.price * i.quantity)}</span>
                <button aria-label="Remove" onClick={() => cart.remove(i.variant_id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 rounded-2xl bg-secondary/50 p-5 text-sm">
            <Row label="Subtotal" value={formatNaira(cart.subtotal)} />
            <Row label="Discount" value={discount ? `− ${formatNaira(discount)}` : "—"} />
            <Row label="Delivery" value="Free" />
            <div className="border-t border-border pt-2"><Row label="Total (pay on delivery)" value={formatNaira(cart.subtotal - discount)} bold /></div>
            {consultation && <p className="pt-2 text-primary">Includes a free 30-second health consultation.</p>}
            {!discount && cart.subtotal < 70000 && (
              <p className="pt-2 text-muted-foreground">Add {formatNaira(70000 - cart.subtotal)} more to get ₦5,000 off.</p>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="h-fit space-y-3 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Delivery details</h2>
          <p className="text-sm text-muted-foreground">We deliver nationwide. Pay when your order arrives.</p>
          <input name="name" required maxLength={100} placeholder="Full name" className={input} />
          <input name="phone" required maxLength={20} placeholder="Phone number" className={input} />
          <input name="email" type="email" maxLength={255} defaultValue={user?.email ?? ""} placeholder="Email (optional)" className={input} />
          <input name="state" required maxLength={60} placeholder="State / City" className={input} />
          <textarea name="address" required maxLength={500} rows={3} placeholder="Delivery address" className={input} />
          <textarea name="notes" maxLength={1000} rows={2} placeholder="Notes (optional)" className={input} />
          <button disabled={busy} className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Placing order…" : `Place order · ${formatNaira(cart.subtotal - discount)}`}
          </button>
          {!user && <p className="text-center text-xs text-muted-foreground"><Link to="/auth" className="underline">Sign in</Link> to track your orders (optional).</p>}
        </form>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
