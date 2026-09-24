import { Link } from "@tanstack/react-router";
import { formatNaira } from "@/lib/pricing";
import type { ShopProduct } from "@/lib/shop.functions";

const STATUS: Record<string, string> = { available: "Available now", out_of_stock: "Sold out — restocking", coming_soon: "Coming soon" };

export function ProduceTicker({ products }: { products: ShopProduct[] }) {
  if (!products.length) return null;
  const items = products.map((p) => {
    const prices = p.variants.map((v) => v.price_ngn);
    return { slug: p.slug, name: p.name, status: STATUS[p.status] ?? "", from: prices.length ? Math.min(...prices) : null };
  });
  const loop = [...items, ...items];
  return (
    <div className="group relative overflow-hidden border-y border-border bg-primary text-primary-foreground">
      <div className="flex w-max animate-[fv-marquee_40s_linear_infinite] gap-10 py-3 group-hover:[animation-play-state:paused]">
        {loop.map((i, idx) => (
          <Link key={idx} to="/shop/$slug" params={{ slug: i.slug }} className="flex items-center gap-2 whitespace-nowrap text-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-semibold">{i.name}</span>
            {i.from != null && <span className="opacity-80">from {formatNaira(i.from)}</span>}
            <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[11px] uppercase tracking-wider">{i.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
