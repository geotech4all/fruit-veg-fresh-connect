import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  Truck,
  Users,
  TrendingUp,
  Warehouse,
  Settings2,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Globe2,
} from "lucide-react";

import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/services")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const ogImage = `${origin}/og-image.jpg`;
    return {
      meta: [
        { title: "Our Services — Fruit&Veg" },
        { name: "description", content: "Fruit&Veg offers fresh produce supply, farmer partnerships, investment opportunities, storage solutions, and agro-processing across Nigeria." },
        { property: "og:title", content: "Our Services — Fruit&Veg" },
        { property: "og:description", content: "Complete agricultural solutions: supply, partnership, investment, storage, and processing." },
        { property: "og:url", content: `${origin}/services` },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:title", content: "Our Services — Fruit&Veg" },
        { name: "twitter:description", content: "Complete agricultural solutions: supply, partnership, investment, storage, and processing." },
      ],
    };
  },
  component: Services,
});

const serviceList = [
  {
    icon: Truck,
    title: "Fresh Produce Supply",
    summary:
      "Reliable retail, wholesale, and bulk delivery of farm-fresh fruits, vegetables, and cash crops to homes, markets, and businesses.",
    bullets: [
      "Farm-to-market direct supply",
      "Retail, wholesale & bulk orders",
      "Scheduled and on-demand delivery",
      "Quality-graded and labelled produce",
    ],
  },
  {
    icon: Users,
    title: "Strategic Partnership",
    summary:
      "We partner with farmers, cooperatives, and agricultural organisations to aggregate produce and create sustainable market access.",
    bullets: [
      "Farmer aggregation & market linkage",
      "Cooperative engagement programs",
      "Transparent pricing & fair trade",
      "Long-term offtake agreements",
    ],
  },
  {
    icon: TrendingUp,
    title: "Investment Support & Opportunities",
    summary:
      "Connecting agricultural investors to vetted farm projects with clear returns, risk management, and transparent reporting.",
    bullets: [
      "Vetted farm investment deals",
      "Periodic ROI & progress reports",
      "Risk mitigation planning",
      "Portfolio diversification options",
    ],
  },
  {
    icon: Warehouse,
    title: "Storage & Preservation Solutions",
    summary:
      "Modern cold storage and preservation infrastructure that reduces post-harvest losses and extends produce shelf life.",
    bullets: [
      "Cold room & bulk storage leasing",
      "Post-harvest handling training",
      "Inventory tracking & management",
      "Reduced spoilage & longer freshness",
    ],
  },
  {
    icon: Settings2,
    title: "Agro-Processing",
    summary:
      "Value-added processing — cleaning, sorting, packaging, and branding — that turns raw produce into premium consumer-ready products.",
    bullets: [
      "Cleaning, sorting & grading",
      "Custom packaging & branding",
      "Semi-processed product lines",
      "Private-label solutions",
    ],
  },
  {
    icon: Globe2,
    title: "Global Export Partnership",
    summary:
      "We are open to partnerships for produce exports to international markets — connecting Nigerian farms to buyers around the world.",
    bullets: [
      "Export-grade sorting & packaging",
      "Documentation & compliance support",
      "Reliable shipping & logistics partners",
      "Long-term offtake for global buyers",
    ],
  },
];

function Services() {
  return (
    <SiteLayout>
      <Hero />
      <ServiceGrid />
      <HowItWorks />
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
            <Leaf size={14} /> What We Do
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-6xl">
            Complete agricultural <span className="text-accent">solutions.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            From farm-fresh supply to processing and investment, we provide end-to-end services
            that connect producers to profitable markets.
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {serviceList.map(({ icon: Icon, title, summary, bullets }) => (
          <div
            key={title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">How it works</span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Simple steps to partner with us.</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Reach Out",
              desc: "Send a supply request or partnership inquiry via our contact page or email.",
            },
            {
              step: "02",
              title: "We Assess & Plan",
              desc: "Our team evaluates your needs and proposes a tailored agricultural solution.",
            },
            {
              step: "03",
              title: "Execute & Deliver",
              desc: "We activate the farm, logistics, or processing pipeline and deliver on schedule.",
            },
          ].map((s) => (
            <div key={s.step} className="relative rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
              <span className="text-5xl font-extrabold text-accent/20">{s.step}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
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
          <h2 className="text-3xl font-bold md:text-5xl">Ready to get started?</h2>
          <p className="mt-4 text-primary-foreground/80 md:text-lg">
            Whether you need fresh supply, storage, processing, or investment opportunities — we are
            ready to partner with you.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105"
          >
            Contact us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
