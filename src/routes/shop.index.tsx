import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Signature } from "@/components/Signature";
import { OfferBanner } from "@/components/OfferBanner";
import { listProducts } from "@/lib/shop.functions";
import { formatNaira } from "@/lib/pricing";

export const productsQuery = queryOptions({ queryKey: ["shop-products"], queryFn: () => listProducts() });

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop Fresh & Healthy Foods — Fruit&Veg" },
      { name: "description", content: "Order Teleios Ofada rice, normal rice, healthy flours, oatmeal and dry okro. Free nationwide delivery. Orders confirmed on payment." },
      { property: "og:title", content: "Shop — Fruit&Veg" },
      { property: "og:description", content: "Clean, stone-free rice and healthy foods. Free delivery. Orders confirmed on payment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
  errorComponent: () => <SiteLayout><p className="p-20 text-center">Could not load products. Please refresh.</p></SiteLayout>,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-16 md:px-8 md:pt-24">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <ShoppingBasket size={14} /> Available now
        </span>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
          Shop clean, healthy <em className="text-primary">food.</em>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          What are you buying and where is your location? Pick your products, and we deliver anywhere in Nigeria.
        </p>
        <div className="mt-10"><OfferBanner /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const min = Math.min(...p.variants.map((v) => v.price_ngn));
            return (
              <Link
                key={p.id}
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} loading="lazy" className="mb-5 aspect-[4/3] w-full rounded-xl object-cover" />
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.category}</span>
                  {p.status !== "available" && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{p.status === "out_of_stock" ? "Out of stock" : "Coming soon"}</span>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-bold">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.variants.map((v) => (
                    <span key={v.id} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{v.label} · {formatNaira(v.price_ngn)}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm">From <strong className="text-primary">{isFinite(min) ? formatNaira(min) : "—"}</strong></span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">Order <ArrowRight size={14} /></span>
                </div>
                <Signature className="mt-4 self-start" />
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
