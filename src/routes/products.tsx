import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Leaf, ArrowRight, ShoppingBasket, PackageCheck, BadgeCheck } from "lucide-react";
import okraImg from "@/assets/okra.jpg";
import pepperImg from "@/assets/pepper.jpg";
import tomatoImg from "@/assets/tomato.jpg";
import maizeImg from "@/assets/maize.jpg";

import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/products")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const ogImage = `${origin}/og-image.jpg`;
    return {
      meta: [
        { title: "Our Products — Fruit&Veg" },
        {
          name: "description",
          content:
            "Farm-fresh okro, pepper, tomato, and maize from Fruit&Veg's farm in Osun State, Nigeria. Wholesale and retail supply available.",
        },
        { property: "og:title", content: "Our Products — Fruit&Veg" },
        {
          property: "og:description",
          content:
            "Premium farm produce: okro, pepper, tomato, and maize — fresh from our farm in Osun State.",
        },
        { property: "og:url", content: `${origin}/products` },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:title", content: "Our Products — Fruit&Veg" },
        { name: "twitter:description", content: "Premium farm produce: okro, pepper, tomato, and maize." },
      ],
    };
  },
  component: Products,
});

const currentProduce = [
  {
    name: "Okro",
    tag: "In Season",
    image: okraImg,
    alt: "Fresh green okra pods",
    description:
      "Tender, fresh okra harvested at peak maturity. Ideal for soups, stews, and traditional dishes.",
  },
  {
    name: "Pepper",
    tag: "Available",
    image: pepperImg,
    alt: "Fresh red and green peppers",
    description:
      "Vibrant, spicy, and flavourful peppers — perfect for sauces, seasoning, and culinary use.",
  },
  {
    name: "Tomato",
    tag: "Available",
    image: tomatoImg,
    alt: "Fresh ripe tomatoes on the vine",
    description:
      "Juicy, sun-ripened tomatoes with rich flavour. Great for fresh consumption, paste, and canning.",
  },
  {
    name: "Maize",
    tag: "Cash Crop",
    image: maizeImg,
    alt: "Fresh yellow corn cobs with green husks",
    description:
      "High-quality maize for consumption, feed, and industrial use. Consistent grade and volume.",
  },
];

function Products() {
  return (
    <SiteLayout>
      <Hero />
      <CurrentProduce />
      <ProductCategories />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-leaf blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <Leaf size={14} /> What We Grow
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-6xl">
            Premium produce from <span className="text-accent">our farm.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Currently growing okro, pepper, tomato, and maize at our farm in Araromi-Owu, Osun State.
            More crops coming as we expand.
          </p>
        </div>
      </div>
    </section>
  );
}

function CurrentProduce() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="mb-12 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Currently on the farm</span>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">Fresh from Araromi-Owu, Osun State.</h2>
        <p className="mt-3 text-muted-foreground">
          Our crops are cultivated with care and harvested at peak freshness for retail, wholesale, and bulk orders.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {currentProduce.map((p) => (
          <div
            key={p.name}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={p.image}
                alt={p.alt}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                {p.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCategories() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Product lines</span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">More ways to buy from us.</h2>
          <p className="mt-3 text-muted-foreground">
            Beyond raw farm produce, we are building product lines for different customer needs.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShoppingBasket,
              title: "Fresh Produce",
              desc: "Direct-from-farm fruits, vegetables, and cash crops in retail and wholesale quantities.",
              status: "Available now",
              statusColor: "text-primary",
            },
            {
              icon: PackageCheck,
              title: "Processed Products",
              desc: "Cleaned, sorted, and packaged produce ready for supermarkets, hotels, and processors.",
              status: "Coming soon",
              statusColor: "text-muted-foreground",
            },
            {
              icon: BadgeCheck,
              title: "Branded Products",
              desc: "Fruit&Veg branded consumer packs and private-label solutions for retail partners.",
              status: "Coming soon",
              statusColor: "text-muted-foreground",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <p className={`mt-4 text-xs font-semibold uppercase tracking-wider ${c.statusColor}`}>{c.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 md:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-bold md:text-5xl">Need supply for your business?</h2>
          <p className="mt-4 text-primary-foreground/80 md:text-lg">
            Restaurants, hotels, retailers, and wholesalers — get reliable farm-direct produce delivered to your door.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105"
          >
            Request a supply quote <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
