import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Gift } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { formatNaira } from "@/lib/pricing";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: z.object({ n: z.string().max(20).catch(""), t: z.coerce.number().catch(0), c: z.coerce.number().catch(0) }),
  head: () => ({
    meta: [
      { title: "Order received — Fruit&Veg" },
      { name: "description", content: "Thank you for your Fruit&Veg order." },
      { property: "og:title", content: "Order received — Fruit&Veg" },
      { property: "og:description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { n, t, c } = Route.useSearch();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <CheckCircle2 size={56} className="mx-auto text-primary" />
        <h1 className="mt-6 font-serif text-5xl">Thank you!</h1>
        <p className="mt-4 text-muted-foreground">Your order <strong className="text-foreground">{n}</strong> has been received. Our team will call you to confirm delivery.</p>
        <p className="mt-2 text-lg font-bold">Pay on delivery: {formatNaira(t)}</p>
        {c === 1 && <p className="mt-2 text-primary">Your free 30-second health consultation is included.</p>}
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm"><Gift size={16} className="text-accent" /> Confirmed today? You'll get our healthy meal guide as a gift.</p>
        <div className="mt-8"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Continue shopping</Link></div>
      </div>
    </SiteLayout>
  );
}
