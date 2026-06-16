import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Truck, ShieldCheck, Sprout, Package, Warehouse } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import produceGrid from "@/assets/produce-grid.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const ogImage = `${origin}/og-image.jpg`;
    return {
      meta: [
        { title: "Fruit&Veg — Fresh From Farm to You" },
        {
          name: "description",
          content:
            "Fruit&Veg is an agricultural company supplying fresh produce, partnering with farmers, and offering storage, processing, and investment solutions across Nigeria.",
        },
        { property: "og:title", content: "Fruit&Veg — Fresh From Farm to You" },
        { property: "og:description", content: "Connecting farms to markets with freshness, quality, and sustainability." },
        { property: "og:url", content: `${origin}/` },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Fruit&Veg farm at golden hour" },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:title", content: "Fruit&Veg — Fresh From Farm to You" },
        { name: "twitter:description", content: "Connecting farms to markets with freshness, quality, and sustainability." },
      ],
    };
  },
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <ValueProps />
      <FeaturedProducts />
      <ServicesTeaser />
      <CTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-12">
        {/* Content */}
        <div className="space-y-10 lg:col-span-6">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <span className="h-[2px] w-8 bg-accent" />
            Agricultural Solutions Company
          </div>

          <div className="space-y-6">
            <h1
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-6xl font-normal leading-[1.02] text-primary md:text-7xl lg:text-[5.5rem]"
            >
              Fresh From <span className="italic text-accent">Farm</span>
              <br />
              to You.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-primary/70">
              We connect farms to markets — supplying premium fruits, vegetables and cash crops with
              quality, sustainability, and value at every step. Partnerships open for produce
              exports worldwide.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-bold text-accent-foreground shadow-xl shadow-accent/20 transition-all hover:brightness-105"
            >
              Request Supply
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary px-8 py-4 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              View Products
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-10 border-t border-primary/10 pt-8">
            {[
              { v: "500+", l: "Partner Farms" },
              { v: "12k", l: "Tons Shipped" },
              { v: "24h", l: "Supply Chain" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-3xl text-primary"
                >
                  {s.v}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary/50">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[3rem] shadow-[var(--shadow-glow)] rotate-2 transition-transform duration-700 ease-out hover:rotate-0">
            <img
              src={heroFarm}
              alt="Lush farm rows at golden hour"
              className="aspect-[4/5] w-full object-cover"
            />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-primary">Export-Grade Quality</div>
                <div className="text-xs text-primary/60">B2B traceability & partnerships</div>
              </div>
            </div>
          </div>

          {/* Small inset image */}
          <div className="absolute -bottom-8 -right-2 z-20 hidden h-44 w-44 overflow-hidden rounded-full border-[10px] border-background shadow-2xl lg:block">
            <img
              src={produceGrid}
              alt="Fresh produce close-up"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


const props = [
  { icon: Sprout, title: "Farm-Direct Freshness", desc: "Sourced and harvested directly from our farm in Osun State." },
  { icon: Truck, title: "Reliable Supply Chain", desc: "Consistent delivery to households, retailers, and wholesalers." },
  { icon: ShieldCheck, title: "Quality Assurance", desc: "Signature labeling and premium grading on every batch." },
  { icon: Leaf, title: "Sustainable Practices", desc: "Responsible agriculture that supports farmers and the land." },
];

function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {props.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const products = [
  { name: "Okro", tag: "In Season" },
  { name: "Pepper", tag: "Available" },
  { name: "Tomato", tag: "Available" },
  { name: "Maize", tag: "Cash Crop" },
];

function FeaturedProducts() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Currently on the farm</span>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Premium produce, <span className="text-primary">harvested fresh.</span></h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We grow and supply quality cash crops, fruits, and vegetables. Place a wholesale or
              retail order anytime.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
              {products.map((p) => (
                <div key={p.name} className="rounded-xl border border-border bg-card px-4 py-3">
                  <p className="text-base font-semibold">{p.name}</p>
                  <p className="text-xs text-accent">{p.tag}</p>
                </div>
              ))}
            </div>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Explore all products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/30 to-primary/20 blur-2xl" />
            <img
              src={produceGrid}
              alt="Fresh okro, pepper, tomato and maize"
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-glow)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  { icon: Truck, title: "Fresh Produce Supply", desc: "Retail, wholesale, and bulk delivery to homes and businesses." },
  { icon: Sprout, title: "Farmer Partnerships", desc: "Aggregating produce and giving farmers market access." },
  { icon: Warehouse, title: "Storage Solutions", desc: "Cold storage and preservation that cut post-harvest losses." },
  { icon: Package, title: "Agro-Processing", desc: "Cleaning, packaging and branded agricultural products." },
];

function ServicesTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">What we do</span>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Complete agricultural solutions.</h2>
        </div>
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
          See all services <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-bold md:text-5xl">Need fresh supply for your business?</h2>
          <p className="mt-4 text-primary-foreground/80 md:text-lg">
            Hotels, restaurants, retailers, and wholesalers — get reliable farm-direct produce at
            competitive pricing.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105"
          >
            Send a supply request <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
