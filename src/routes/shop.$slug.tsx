import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Signature } from "@/components/Signature";
import { OfferBanner } from "@/components/OfferBanner";
import { getProduct } from "@/lib/shop.functions";
import { formatNaira } from "@/lib/pricing";
import { useCart } from "@/lib/cart";

const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["shop-product", slug], queryFn: () => getProduct({ data: { slug } }) });

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    return { name: p.name, desc: p.short_description ?? "" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Fruit&Veg" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.name} — Fruit&Veg Shop` },
        { name: "description", content: loaderData.desc },
        { property: "og:title", content: `${loaderData.name} — Fruit&Veg` },
        { property: "og:description", content: loaderData.desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout><div className="p-20 text-center">Product not found. <Link to="/shop" className="text-primary underline">Back to shop</Link></div></SiteLayout>
  ),
  errorComponent: () => <SiteLayout><p className="p-20 text-center">Could not load this product.</p></SiteLayout>,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const cart = useCart();
  const navigate = useNavigate();
  const [variantId, setVariantId] = useState(p?.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  if (!p) return null;
  const variant = p.variants.find((v) => v.id === variantId);
  const canBuy = p.status === "available" && variant?.in_stock;

  const add = (go: boolean) => {
    if (!variant) return;
    cart.add({ variant_id: variant.id, product_slug: p.slug, product_name: p.name, label: variant.label, price: variant.price_ngn, quantity: qty });
    toast.success(`${p.name} (${variant.label}) added to your order`);
    if (go) navigate({ to: "/cart" });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} /> All products</Link>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-secondary">
            {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <span className="font-serif text-4xl text-primary">{p.name}</span>}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">{p.category}</span>
            <h1 className="mt-2 font-serif text-4xl md:text-5xl">{p.name}</h1>
            <Signature className="mt-4" />
            <p className="mt-5 leading-relaxed text-muted-foreground">{p.description}</p>

            <p className="mt-8 text-sm font-semibold">Choose size</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {p.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={!v.in_stock}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all disabled:opacity-40 ${v.id === variantId ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`}
                >
                  <span className="block text-sm font-semibold">{v.label}</span>
                  <span className="text-sm text-primary">{formatNaira(v.price_ngn)}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button aria-label="Less" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button aria-label="More" className="p-3" onClick={() => setQty((q) => q + 1)}><Plus size={14} /></button>
              </div>
              {variant && <span className="text-lg font-bold">{formatNaira(variant.price_ngn * qty)}</span>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button disabled={!canBuy} onClick={() => add(true)} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">Order now</button>
              <button disabled={!canBuy} onClick={() => add(false)} className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary disabled:opacity-50">Add to order</button>
            </div>
            {p.bulk_available && (
              <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent"><Truck size={16} /> Need bulk supply? Request a quote</Link>
            )}
          </div>
        </div>
        <div className="mt-14"><OfferBanner /></div>
      </div>
    </SiteLayout>
  );
}
