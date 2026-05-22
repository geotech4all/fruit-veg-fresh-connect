import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Users, TrendingUp, Truck, ShieldCheck, Leaf, Globe, ArrowRight, HeartHandshake, PackageCheck, BadgeCheck, Store, Factory, ClipboardCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership & Partnership — Fruit&Veg" },
      {
        name: "description",
        content:
          "Join Fruit&Veg as a supply partner, investor, or wholesale buyer. Discover why businesses choose us for fresh produce, export partnerships, and agricultural solutions.",
      },
      { property: "og:title", content: "Membership & Partnership — Fruit&Veg" },
      {
        property: "og:description",
        content: "Partner with Fruit&Veg for fresh produce supply, export opportunities, and agricultural investment.",
      },
      { property: "og:url", content: "/membership" },
    ],
  }),
  component: Membership,
});

const whyChoose = [
  {
    icon: Leaf,
    title: "Farm-Direct Freshness",
    desc: "Produce comes straight from our farm and partner farms — no long warehousing delays. You get peak freshness every time.",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    desc: "Signature labeling, grading, and inspection on every batch. We stand behind the quality of what we supply.",
  },
  {
    icon: Truck,
    title: "Reliable Logistics",
    desc: "Consistent delivery schedules, proper handling, and cold-chain options to protect produce in transit.",
  },
  {
    icon: Globe,
    title: "Export Partnership Ready",
    desc: "We partner with exporters and international buyers for produce shipments. Documentation, sorting, and logistics support included.",
  },
  {
    icon: TrendingUp,
    title: "Investment Opportunities",
    desc: "Agricultural investors can participate in our farm cycles with clear reporting and fair value-sharing structures.",
  },
  {
    icon: HeartHandshake,
    title: "Farmer-First Relationships",
    desc: "We work directly with farmers, ensuring fair pricing, better market access, and sustainable community impact.",
  },
];

const targetCustomers = [
  { icon: Store, title: "Retailers", desc: "Supermarkets, grocery stores, and neighborhood markets needing consistent fresh produce supply." },
  { icon: Users, title: "Wholesalers & Distributors", desc: "Bulk buyers and market aggregators looking for reliable farm-direct sourcing at scale." },
  { icon: Factory, title: "Agro-Processors", desc: "Businesses that clean, package, or process produce into branded consumer goods." },
  { icon: BadgeCheck, title: "Hotels & Restaurants", desc: "Hospitality businesses requiring fresh, high-quality vegetables and fruits for daily operations." },
  { icon: TrendingUp, title: "Agricultural Investors", desc: "Investors seeking structured farm partnerships with transparent reporting and measurable returns." },
  { icon: Globe, title: "Export Partners", desc: "International buyers and export companies looking for Nigerian produce with proper documentation and logistics." },
];

const membershipBenefits = [
  {
    title: "Supply Partners",
    icon: PackageCheck,
    points: [
      "Priority produce allocation during peak harvests",
      "Volume discounts and flexible delivery schedules",
      "Dedicated account support for orders and fulfillment",
      "Early access to new product lines and seasonal crops",
    ],
  },
  {
    title: "Export Partners",
    icon: Globe,
    points: [
      "Export-grade sorting and quality grading",
      "Phytosanitary and shipping documentation support",
      "Consolidated logistics and freight coordination",
      "Long-term offtake agreements available",
    ],
  },
  {
    title: "Investor Partners",
    icon: TrendingUp,
    points: [
      "Transparent farm-cycle reporting and metrics",
      "Structured risk-sharing and return models",
      "Direct farm visits and progress updates",
      "Diversified crop portfolio across seasons",
    ],
  },
];

function Membership() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-leaf/70" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">
              <Award size={14} /> Partnership & Membership
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-primary-foreground md:text-6xl">
              Grow with <span className="text-accent">Fruit&Veg.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              Whether you are a buyer, investor, or export partner — we build relationships that
              create value across the agricultural supply chain.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105 hover:shadow-xl"
              >
                Become a Partner <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
              >
                View Our Produce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Why choose us</span>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">The Fruit&Veg difference.</h2>
          <p className="mt-4 text-muted-foreground">
            We do not just supply produce — we deliver trust, consistency, and partnerships that scale.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Customers */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Who we serve</span>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Built for every link in the chain.</h2>
            <p className="mt-4 text-muted-foreground">
              From local retailers to global exporters, we tailor our partnerships to fit your needs.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {targetCustomers.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/40 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Partnership tiers</span>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Choose your partnership path.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We offer structured partnership options designed to create mutual value for buyers, exporters, and investors.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {membershipBenefits.map(({ title, icon: Icon, points }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <ul className="mt-6 space-y-3">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <ClipboardCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-leaf/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Ready to partner with us?</h2>
            <p className="mt-4 text-primary-foreground/80 md:text-lg">
              Whether you are looking for supply, export collaboration, or investment — we are ready to talk.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105"
            >
              Start the conversation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
