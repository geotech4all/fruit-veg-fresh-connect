import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
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
      { name: "description", content: "Review your order and checkout. Free delivery nationwide." },
      { property: "og:title", content: "Your Order — Fruit&Veg" },
      { property: "og:description", content: "Checkout with free nationwide delivery." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

const input = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const SAVED_KEY = "fv-delivery-details";
const SAVED_FIELDS = ["name", "phone", "email", "state", "city", "address", "landmark"];
const NG_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

function CartPage() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const place = useServerFn(createOrder);
  const [busy, setBusy] = useState(false);
  const { discount, consultation } = computeDiscount(cart.subtotal);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "null");
      const form = formRef.current;
      if (!saved || !form) return;
      for (const k of SAVED_FIELDS) {
        const el = form.elements.namedItem(k) as HTMLInputElement | null;
        if (el && saved[k] && !el.value) el.value = saved[k];
      }
    } catch {}
  }, [cart.items.length]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    if (f.get("remember")) localStorage.setItem(SAVED_KEY, JSON.stringify(Object.fromEntries(SAVED_FIELDS.map((k) => [k, get(k)]))));
    else localStorage.removeItem(SAVED_KEY);
    const address = [get("address"), get("city"), get("landmark") && `Near ${get("landmark")}`].filter(Boolean).join(", ");
    setBusy(true);
    try {
      const res = await place({
        data: {
          customer_name: get("name"),
          phone: get("phone"),
          email: get("email"),
          delivery_address: address,
          state: get("state"),
          notes: get("notes"),
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
            <div className="border-t border-border pt-2"><Row label="Total" value={formatNaira(cart.subtotal - discount)} bold /></div>
            {consultation && <p className="pt-2 text-primary">Includes a free 30-second health consultation.</p>}
            {!discount && cart.subtotal <= 200000 && (
              <p className="pt-2 text-muted-foreground">Spend over ₦200,000 (add {formatNaira(200001 - cart.subtotal)} more) to get ₦10,000 off.</p>
            )}
          </div>
        </div>

        <form ref={formRef} onSubmit={submit} className="h-fit space-y-3 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Delivery details</h2>
          <p className="text-sm text-muted-foreground">We deliver nationwide. Pay when your order arrives.</p>
          <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-accent">Contact</p>
          <label className="block text-sm font-medium">Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input + " mt-1"} /></label>
          <label className="block text-sm font-medium">Phone / WhatsApp<input name="phone" type="tel" required minLength={7} maxLength={20} pattern="[0-9+ ()-]{7,20}" autoComplete="tel" placeholder="e.g. 0803 000 0000" className={input + " mt-1"} /></label>
          <label className="block text-sm font-medium">Email (optional)<input name="email" type="email" maxLength={255} defaultValue={user?.email ?? ""} autoComplete="email" className={input + " mt-1"} /></label>
          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-accent">Delivery address</p>
          <label className="block text-sm font-medium">State<select name="state" required className={input + " mt-1"} defaultValue="">
            <option value="" disabled>Select state</option>
            {NG_STATES.map((s) => <option key={s}>{s}</option>)}
          </select></label>
          <label className="block text-sm font-medium">City / Town<input name="city" required maxLength={60} autoComplete="address-level2" className={input + " mt-1"} /></label>
          <label className="block text-sm font-medium">Street address<textarea name="address" required minLength={5} maxLength={400} rows={2} autoComplete="street-address" placeholder="House number, street, area" className={input + " mt-1"} /></label>
          <label className="block text-sm font-medium">Nearest landmark / bus stop (optional)<input name="landmark" maxLength={80} className={input + " mt-1"} /></label>
          <label className="block text-sm font-medium">Notes (optional)<textarea name="notes" maxLength={1000} rows={2} placeholder="Best time to deliver, etc." className={input + " mt-1"} /></label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="remember" defaultChecked /> Remember my details on this device</label>
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
