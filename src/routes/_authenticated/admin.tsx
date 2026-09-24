import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatNaira } from "@/lib/pricing";
import { SiteLayout } from "@/components/SiteLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Team Dashboard — Fruit&Veg" },
      { name: "description", content: "Manage Fruit&Veg products, orders, payments, inventory and finances." },
      { property: "og:title", content: "Team Dashboard — Fruit&Veg" },
      { property: "og:description", content: "Fruit&Veg team dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const ORDER_STATUSES = ["new", "confirmed", "out_for_delivery", "delivered", "cancelled"];
const PAY_STATUSES = ["unpaid", "paid", "refunded"];
const PRODUCT_STATUSES = ["available", "out_of_stock", "coming_soon", "hidden"];
const label = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const input = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";
const btn = "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50";
const card = "rounded-2xl border border-border bg-card p-5";

function AdminPage() {
  const { isTeam, isAdmin, loading } = useAuth();
  if (loading) return <SiteLayout><div className="p-16 text-center">Loading…</div></SiteLayout>;
  if (!isTeam)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg p-16 text-center">
          <h1 className="font-serif text-3xl">Team access only</h1>
          <p className="mt-2 text-muted-foreground">This area is for invited Fruit&Veg team members.</p>
        </div>
      </SiteLayout>
    );
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="font-serif text-4xl">Team dashboard</h1>
        <Tabs defaultValue="finance" className="mt-6">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="orders">Orders & payments</TabsTrigger>
            <TabsTrigger value="products">Products & prices</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="expenses">Production costs</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
          </TabsList>
          <TabsContent value="finance"><Finance /></TabsContent>
          <TabsContent value="orders"><Orders /></TabsContent>
          <TabsContent value="products"><Products /></TabsContent>
          <TabsContent value="inventory"><Inventory /></TabsContent>
          <TabsContent value="expenses"><Expenses /></TabsContent>
          <TabsContent value="members"><Members /></TabsContent>
          {isAdmin && <TabsContent value="team"><Team /></TabsContent>}
        </Tabs>
      </div>
    </SiteLayout>
  );
}

function useLoad<T>(fn: () => Promise<T>, init: T) {
  const [data, setData] = useState<T>(init);
  const reload = () => fn().then(setData).catch((e) => toast.error(String(e.message ?? e)));
  useEffect(() => { reload(); }, []);
  return [data, reload] as const;
}

function Stat({ title, value, tone }: { title: string; value: ReactNode; tone?: "good" | "bad" }) {
  return (
    <div className={card}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className={`mt-1 text-2xl font-bold ${tone === "good" ? "text-primary" : tone === "bad" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}

/* ---------------- Finance ---------------- */
function Finance() {
  const [d] = useLoad(async () => {
    const [o, i, v, e, p] = await Promise.all([
      supabase.from("orders").select("id, status, total_ngn, discount_ngn"),
      supabase.from("order_items").select("order_id, variant_id, product_name, quantity, line_total_ngn"),
      supabase.from("product_variants").select("id, cost_price_ngn, stock_qty, price_ngn"),
      supabase.from("expenses").select("amount_ngn, product_id, category"),
      supabase.from("payments").select("amount_ngn"),
    ]);
    return { orders: o.data ?? [], items: i.data ?? [], variants: v.data ?? [], expenses: e.data ?? [], payments: p.data ?? [] };
  }, { orders: [], items: [], variants: [], expenses: [], payments: [] } as any);

  const s = useMemo(() => {
    const live = new Set(d.orders.filter((o: any) => o.status !== "cancelled").map((o: any) => o.id));
    const cost = new Map(d.variants.map((v: any) => [v.id, v.cost_price_ngn]));
    const revenue = d.orders.filter((o: any) => live.has(o.id)).reduce((a: number, o: any) => a + o.total_ngn, 0);
    const byProduct = new Map<string, { units: number; sales: number; cogs: number }>();
    let cogs = 0;
    for (const it of d.items) {
      if (!live.has(it.order_id)) continue;
      const c = (Number(cost.get(it.variant_id)) || 0) * it.quantity;
      cogs += c;
      const r = byProduct.get(it.product_name) ?? { units: 0, sales: 0, cogs: 0 };
      r.units += it.quantity; r.sales += it.line_total_ngn; r.cogs += c;
      byProduct.set(it.product_name, r);
    }
    const expenses = d.expenses.reduce((a: number, e: any) => a + e.amount_ngn, 0);
    const collected = d.payments.reduce((a: number, p: any) => a + p.amount_ngn, 0);
    const stockValue = d.variants.reduce((a: number, v: any) => a + v.stock_qty * v.cost_price_ngn, 0);
    const stockRetail = d.variants.reduce((a: number, v: any) => a + v.stock_qty * v.price_ngn, 0);
    return { revenue, cogs, expenses, collected, stockValue, stockRetail, gross: revenue - cogs, net: revenue - cogs - expenses, byProduct: [...byProduct.entries()] };
  }, [d]);

  return (
    <div className="mt-4 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Sales (excl. cancelled)" value={formatNaira(s.revenue)} />
        <Stat title="Money collected" value={formatNaira(s.collected)} />
        <Stat title="Cost of goods sold" value={formatNaira(s.cogs)} />
        <Stat title="Production & other costs" value={formatNaira(s.expenses)} />
        <Stat title="Gross profit" value={formatNaira(s.gross)} tone={s.gross >= 0 ? "good" : "bad"} />
        <Stat title="Net profit" value={formatNaira(s.net)} tone={s.net >= 0 ? "good" : "bad"} />
        <Stat title="Stock value (at cost)" value={formatNaira(s.stockValue)} />
        <Stat title="Stock value (at selling price)" value={formatNaira(s.stockRetail)} />
      </div>
      <div className={card}>
        <h2 className="font-semibold">Sales vs cost by product</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th>Product</th><th>Units</th><th>Sales</th><th>Cost</th><th>Margin</th></tr></thead>
          <tbody>
            {s.byProduct.map(([name, r]) => (
              <tr key={name} className="border-t border-border">
                <td className="py-2">{name}</td><td>{r.units}</td><td>{formatNaira(r.sales)}</td><td>{formatNaira(r.cogs)}</td>
                <td>{r.sales ? Math.round(((r.sales - r.cogs) / r.sales) * 100) : 0}%</td>
              </tr>
            ))}
            {!s.byProduct.length && <tr><td colSpan={5} className="py-4 text-muted-foreground">No sales yet.</td></tr>}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">Cost uses each size's cost price (set in Inventory). Sales totals are after discounts.</p>
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
function Orders() {
  const [filter, setFilter] = useState("all");
  const [orders, reload] = useLoad(async () => {
    const { data } = await supabase.from("orders").select("*, order_items(*), payments(*)").order("created_at", { ascending: false });
    return data ?? [];
  }, [] as any[]);
  const list = orders.filter((o) => filter === "all" || o.status === filter);

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    error ? toast.error(error.message) : reload();
  };
  const recordPayment = async (o: any, form: HTMLFormElement) => {
    const f = new FormData(form);
    const amount = Number(f.get("amount"));
    if (!amount) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("payments").insert({ order_id: o.id, amount_ngn: amount, method: String(f.get("method")), reference: String(f.get("ref") || "") || null, recorded_by: u.user?.id });
    if (error) return toast.error(error.message);
    const paid = o.payments.reduce((a: number, p: any) => a + p.amount_ngn, 0) + amount;
    if (paid >= o.total_ngn) await update(o.id, { payment_status: "paid" }); else reload();
    form.reset();
    toast.success("Payment recorded");
  };

  return (
    <div className="mt-4 space-y-4">
      <select className={input + " max-w-xs"} value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All orders</option>
        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
      </select>
      {list.map((o) => {
        const paid = o.payments.reduce((a: number, p: any) => a + p.amount_ngn, 0);
        return (
          <div key={o.id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{o.order_number} · {o.customer_name}</div>
                <div className="text-sm text-muted-foreground">{o.phone} · {o.delivery_address}, {o.state} · {new Date(o.created_at).toLocaleString()}</div>
                <ul className="mt-2 text-sm">
                  {o.order_items.map((it: any) => <li key={it.id}>{it.quantity} × {it.product_name} ({it.variant_label}) — {formatNaira(it.line_total_ngn)}</li>)}
                </ul>
                {o.notes && <p className="mt-1 text-sm italic">“{o.notes}”</p>}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{formatNaira(o.total_ngn)}</div>
                <div className="text-xs text-muted-foreground">Paid {formatNaira(paid)}</div>
                <div className="mt-2 flex gap-2">
                  <select className={input} value={o.status} onChange={(e) => update(o.id, { status: e.target.value })}>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                  </select>
                  <select className={input} value={o.payment_status} onChange={(e) => update(o.id, { payment_status: e.target.value })}>
                    {PAY_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); recordPayment(o, e.currentTarget); }}>
              <input name="amount" type="number" placeholder="Amount ₦" className={input + " max-w-[140px]"} />
              <select name="method" className={input + " max-w-[140px]"}><option value="cash">Cash</option><option value="transfer">Transfer</option><option value="pos">POS</option></select>
              <input name="ref" placeholder="Reference (optional)" className={input + " max-w-[200px]"} />
              <button className={btn}>Record payment</button>
            </form>
          </div>
        );
      })}
      {!list.length && <p className="text-muted-foreground">No orders.</p>}
    </div>
  );
}

/* ---------------- Products ---------------- */
function Products() {
  const [products, reload] = useLoad(async () => {
    const { data } = await supabase.from("products").select("*, product_variants(*)").order("sort_order");
    return data ?? [];
  }, [] as any[]);

  const saveProduct = async (id: string, patch: any) => {
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    error ? toast.error(error.message) : (toast.success("Saved"), reload());
  };
  const saveVariant = async (id: string, patch: any) => {
    const { error } = await supabase.from("product_variants").update(patch).eq("id", id);
    error ? toast.error(error.message) : (toast.success("Saved"), reload());
  };
  const addVariant = async (product_id: string, form: HTMLFormElement) => {
    const f = new FormData(form);
    const { error } = await supabase.from("product_variants").insert({ product_id, label: String(f.get("label")), price_ngn: Number(f.get("price")), sort_order: 99 });
    error ? toast.error(error.message) : (form.reset(), reload());
  };
  const addProduct = async (form: HTMLFormElement) => {
    const f = new FormData(form);
    const name = String(f.get("name")).trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("products").insert({ name, slug, category: String(f.get("category") || "Healthy Foods"), short_description: String(f.get("short") || "") || null, image_url: String(f.get("image") || "") || null, sort_order: 99 });
    error ? toast.error(error.message) : (form.reset(), toast.success("Product added — now add sizes"), reload());
  };

  return (
    <div className="mt-4 space-y-4">
      <form className={card + " grid gap-2 md:grid-cols-5"} onSubmit={(e) => { e.preventDefault(); addProduct(e.currentTarget); }}>
        <input name="name" required placeholder="New product name" className={input} />
        <input name="category" placeholder="Category" className={input} />
        <input name="short" placeholder="Short description" className={input} />
        <input name="image" placeholder="Photo link (optional)" className={input} />
        <button className={btn}>Add product</button>
      </form>
      {products.map((p) => (
        <div key={p.id} className={card}>
          <div className="grid gap-2 md:grid-cols-4">
            <input defaultValue={p.name} className={input} onBlur={(e) => e.target.value !== p.name && saveProduct(p.id, { name: e.target.value })} />
            <input defaultValue={p.short_description ?? ""} placeholder="Short description" className={input + " md:col-span-2"} onBlur={(e) => e.target.value !== (p.short_description ?? "") && saveProduct(p.id, { short_description: e.target.value })} />
            <select className={input} value={p.status} onChange={(e) => saveProduct(p.id, { status: e.target.value })}>
              {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <input defaultValue={p.image_url ?? ""} placeholder="Photo link" className={input + " md:col-span-3"} onBlur={(e) => e.target.value !== (p.image_url ?? "") && saveProduct(p.id, { image_url: e.target.value || null })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.bulk_available} onChange={(e) => saveProduct(p.id, { bulk_available: e.target.checked })} /> Bulk supply</label>
          </div>
          <div className="mt-3 space-y-2">
            {[...p.product_variants].sort((a: any, b: any) => a.sort_order - b.sort_order).map((v: any) => (
              <div key={v.id} className="flex flex-wrap items-center gap-2 text-sm">
                <input defaultValue={v.label} className={input + " max-w-[120px]"} onBlur={(e) => e.target.value !== v.label && saveVariant(v.id, { label: e.target.value })} />
                <span>₦</span>
                <input type="number" defaultValue={v.price_ngn} className={input + " max-w-[140px]"} onBlur={(e) => Number(e.target.value) !== v.price_ngn && saveVariant(v.id, { price_ngn: Number(e.target.value) })} />
                <label className="flex items-center gap-1"><input type="checkbox" checked={v.in_stock} onChange={(e) => saveVariant(v.id, { in_stock: e.target.checked })} /> In stock</label>
              </div>
            ))}
            <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); addVariant(p.id, e.currentTarget); }}>
              <input name="label" required placeholder="Size e.g. 10kg" className={input + " max-w-[120px]"} />
              <input name="price" required type="number" placeholder="Price ₦" className={input + " max-w-[140px]"} />
              <button className="rounded-full border border-border px-4 py-2 text-sm">Add size</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Inventory ---------------- */
function Inventory() {
  const [rows, reload] = useLoad(async () => {
    const { data } = await supabase.from("product_variants").select("id, label, price_ngn, cost_price_ngn, stock_qty, products(name)").order("product_id");
    return data ?? [];
  }, [] as any[]);
  const [moves, reloadMoves] = useLoad(async () => {
    const { data } = await supabase.from("stock_movements").select("*, product_variants(label, products(name))").order("created_at", { ascending: false }).limit(30);
    return data ?? [];
  }, [] as any[]);

  const move = async (v: any, form: HTMLFormElement) => {
    const f = new FormData(form);
    const qty = Number(f.get("qty"));
    if (!qty) return;
    const reason = String(f.get("reason"));
    const cost = Number(f.get("cost")) || null;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("stock_movements").insert({ variant_id: v.id, change: reason === "restock" ? Math.abs(qty) : -Math.abs(qty), reason, unit_cost_ngn: reason === "restock" ? cost : null, recorded_by: u.user?.id });
    error ? toast.error(error.message) : (form.reset(), reload(), reloadMoves());
  };
  const setCost = async (id: string, cost: number) => {
    const { error } = await supabase.from("product_variants").update({ cost_price_ngn: cost }).eq("id", id);
    error ? toast.error(error.message) : reload();
  };

  return (
    <div className="mt-4 space-y-6">
      <div className={card + " overflow-x-auto"}>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th>Product</th><th>Size</th><th>In stock</th><th>Cost price</th><th>Selling</th><th>Margin</th><th>Add / remove stock</th></tr></thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-t border-border">
                <td className="py-2">{v.products?.name}</td>
                <td>{v.label}</td>
                <td className={v.stock_qty <= 0 ? "font-semibold text-destructive" : "font-semibold"}>{v.stock_qty}</td>
                <td><input type="number" defaultValue={v.cost_price_ngn} className={input + " max-w-[110px]"} onBlur={(e) => Number(e.target.value) !== v.cost_price_ngn && setCost(v.id, Number(e.target.value))} /></td>
                <td>{formatNaira(v.price_ngn)}</td>
                <td>{v.cost_price_ngn ? Math.round(((v.price_ngn - v.cost_price_ngn) / v.price_ngn) * 100) + "%" : "—"}</td>
                <td>
                  <form className="flex gap-1" onSubmit={(e) => { e.preventDefault(); move(v, e.currentTarget); }}>
                    <select name="reason" className={input + " max-w-[110px]"}><option value="restock">Restock</option><option value="damaged">Damaged</option><option value="adjustment">Adjust (−)</option></select>
                    <input name="qty" type="number" placeholder="Qty" className={input + " max-w-[70px]"} />
                    <input name="cost" type="number" placeholder="Unit cost" className={input + " max-w-[100px]"} />
                    <button className={btn}>Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">Stock goes down automatically when customers order. Restocking with a unit cost updates the cost price.</p>
      </div>
      <div className={card}>
        <h2 className="font-semibold">Recent stock changes</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {moves.map((m) => (
            <li key={m.id}>{new Date(m.created_at).toLocaleDateString()} · {m.product_variants?.products?.name} {m.product_variants?.label} · <b>{m.change > 0 ? "+" : ""}{m.change}</b> ({m.reason})</li>
          ))}
          {!moves.length && <li className="text-muted-foreground">No changes yet.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Expenses ---------------- */
const EXPENSE_CATS = ["Production", "Farm labour", "Seeds & inputs", "Processing", "Packaging", "Transport & delivery", "Storage", "Marketing", "Other"];
function Expenses() {
  const [data, reload] = useLoad(async () => {
    const [e, p] = await Promise.all([
      supabase.from("expenses").select("*, products(name)").order("spent_on", { ascending: false }),
      supabase.from("products").select("id, name").order("sort_order"),
    ]);
    return { expenses: e.data ?? [], products: p.data ?? [] };
  }, { expenses: [], products: [] } as any);

  const add = async (form: HTMLFormElement) => {
    const f = new FormData(form);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("expenses").insert({
      category: String(f.get("category")), description: String(f.get("description")), amount_ngn: Number(f.get("amount")),
      product_id: String(f.get("product") || "") || null, spent_on: String(f.get("date") || "") || undefined, recorded_by: u.user?.id,
    });
    error ? toast.error(error.message) : (form.reset(), reload());
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    error ? toast.error(error.message) : reload();
  };
  const byCat = data.expenses.reduce((m: Record<string, number>, e: any) => ({ ...m, [e.category]: (m[e.category] ?? 0) + e.amount_ngn }), {});

  return (
    <div className="mt-4 space-y-4">
      <form className={card + " grid gap-2 md:grid-cols-6"} onSubmit={(e) => { e.preventDefault(); add(e.currentTarget); }}>
        <select name="category" className={input}>{EXPENSE_CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <input name="description" required placeholder="What was it for?" className={input + " md:col-span-2"} />
        <input name="amount" required type="number" placeholder="Amount ₦" className={input} />
        <select name="product" className={input}><option value="">General (no product)</option>{data.products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <input name="date" type="date" className={input} />
        <button className={btn + " md:col-span-6 md:justify-self-start"}>Add cost</button>
      </form>
      <div className="flex flex-wrap gap-2">
        {Object.entries(byCat).map(([c, v]) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm">{c}: <b>{formatNaira(v as number)}</b></span>)}
      </div>
      <div className={card}>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th>Date</th><th>Category</th><th>Description</th><th>Product</th><th>Amount</th><th /></tr></thead>
          <tbody>
            {data.expenses.map((e: any) => (
              <tr key={e.id} className="border-t border-border">
                <td className="py-2">{e.spent_on}</td><td>{e.category}</td><td>{e.description}</td><td>{e.products?.name ?? "—"}</td><td>{formatNaira(e.amount_ngn)}</td>
                <td><button onClick={() => remove(e.id)} className="text-xs text-destructive">Delete</button></td>
              </tr>
            ))}
            {!data.expenses.length && <tr><td colSpan={6} className="py-4 text-muted-foreground">No costs recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Team ---------------- */
function Team() {
  const [data, reload] = useLoad(async () => {
    const [i, r] = await Promise.all([
      supabase.from("team_invites").select("*").order("created_at"),
      supabase.from("user_roles").select("*").in("role", ["admin", "staff"]),
    ]);
    return { invites: i.data ?? [], roles: r.data ?? [] };
  }, { invites: [], roles: [] } as any);

  const invite = async (form: HTMLFormElement) => {
    const f = new FormData(form);
    const email = String(f.get("email")).trim().toLowerCase();
    const { error } = await supabase.from("team_invites").insert({ email, role: String(f.get("role")) as any });
    error ? toast.error(error.message) : (form.reset(), toast.success(`Invited ${email}. Ask them to sign up with this email.`), reload());
  };
  const removeInvite = async (id: string) => { await supabase.from("team_invites").delete().eq("id", id); reload(); };
  const removeRole = async (id: string) => { await supabase.from("user_roles").delete().eq("id", id); reload(); };

  return (
    <div className="mt-4 space-y-4">
      <form className={card + " flex flex-wrap gap-2"} onSubmit={(e) => { e.preventDefault(); invite(e.currentTarget); }}>
        <input name="email" type="email" required placeholder="Team member email" className={input + " max-w-xs"} />
        <select name="role" className={input + " max-w-[140px]"}><option value="staff">Team member</option><option value="admin">Admin</option></select>
        <button className={btn}>Invite</button>
      </form>
      <div className={card}>
        <h2 className="font-semibold">Invites</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {data.invites.map((i: any) => (
            <li key={i.id} className="flex items-center gap-3">{i.email} · {label(i.role)} · {i.accepted_at ? "Joined" : "Pending"}
              <button onClick={() => removeInvite(i.id)} className="text-xs text-destructive">Remove invite</button></li>
          ))}
        </ul>
        <h2 className="mt-5 font-semibold">Active access</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {data.roles.map((r: any) => (
            <li key={r.id} className="flex items-center gap-3">User {r.user_id.slice(0, 8)}… · {label(r.role)}
              <button onClick={() => removeRole(r.id)} className="text-xs text-destructive">Remove access</button></li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">To fully remove someone, remove their invite and their access.</p>
      </div>
    </div>
  );
}

/* ---------------- Members ---------------- */
function Members() {
  const [members] = useLoad(async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, [] as any[]);
  const subscribed = members.filter((m) => m.newsletter);
  const exportCsv = () => {
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Name", "Email", "Phone", "Location", "Interests", "Newsletter", "Joined"], ...members.map((m) => [m.full_name, m.email, m.phone, m.location, m.interests.join("; "), m.newsletter ? "Yes" : "No", m.created_at.slice(0, 10)])];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "fruitveg-members.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const mailAll = () => {
    window.location.href = `mailto:fruitvegfarm@gmail.com?bcc=${encodeURIComponent(subscribed.map((m) => m.email).join(","))}&subject=${encodeURIComponent("New produce available at Fruit&Veg")}`;
  };
  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Stat title="Members" value={members.length} />
        <Stat title="Newsletter subscribers" value={subscribed.length} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={exportCsv} className={btn}>Export to spreadsheet</button>
        <button onClick={mailAll} disabled={!subscribed.length} className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50">Email all subscribers</button>
      </div>
      <div className={card + " overflow-x-auto"}>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Interests</th><th>Joined</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="py-2">{m.full_name}</td><td>{m.email}</td><td>{m.phone ?? "—"}</td><td>{m.location ?? "—"}</td><td>{m.interests.join(", ")}</td><td>{m.created_at.slice(0, 10)}</td>
              </tr>
            ))}
            {!members.length && <tr><td colSpan={6} className="py-4 text-muted-foreground">No members yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
