import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Truck, ShieldCheck, Sprout, Package, Warehouse } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import produceGrid from "@/assets/produce-grid.jpg";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fruit&Veg — Fresh From Farm to You" },
      {
        name: "description",
        content:
          "Fruit&Veg is an agricultural company supplying fresh produce, partnering with farmers, and offering storage, processing, and investment solutions across Nigeria.",
      },
      { property: "og:title", content: "Fruit&Veg — Fresh From Farm to You" },
      { property: "og:description", content: "Connecting farms to markets with freshness, quality, and sustainability." },
      { property: "og:url", content: "/" },
    ],
  }),
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
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroFarm} alt="Lush farm at golden hour" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/40" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Leaf size={14} /> Agricultural Solutions Company
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-primary-foreground md:text-7xl">
            Fresh From <span className="text-accent">Farm</span> <br className="hidden md:block" /> to You.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
            We connect farms to markets — supplying premium fruits, vegetables and cash crops with
            quality, sustainability, and value at every step.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105 hover:shadow-xl"
            >
              Request Supply <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
            >
              View Products
            </Link>
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
