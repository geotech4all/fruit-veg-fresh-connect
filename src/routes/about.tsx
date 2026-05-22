import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Leaf, Lightbulb, Users, Heart, ArrowRight, Target, Eye } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fruit&Veg" },
      {
        name: "description",
        content:
          "Fruit&Veg connects farms to markets — supplying fresh produce, partnering with farmers, and advancing agricultural investment, storage and processing.",
      },
      { property: "og:title", content: "About Fruit&Veg" },
      { property: "og:description", content: "An agricultural solutions company bridging farmers, retailers, and consumers." },
      { property: "og:url", content: "/about" },
    ],
  }),
  component: About,
});

const values = [
  { icon: ShieldCheck, title: "Quality", desc: "Freshness, hygiene, and premium standards in every product and service." },
  { icon: Sparkles, title: "Integrity", desc: "Transparency, fairness, and trust in all business relationships." },
  { icon: Leaf, title: "Sustainability", desc: "Environmentally responsible agriculture and food preservation systems." },
  { icon: Lightbulb, title: "Innovation", desc: "Modern agricultural technology, storage and processing solutions." },
  { icon: Users, title: "Community Impact", desc: "Empowering farmers and strengthening local agricultural economies." },
  { icon: Heart, title: "Customer Satisfaction", desc: "Reliable service and exceptional experiences for every customer." },
];

function About() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">About Fruit&amp;Veg</span>
            <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] md:text-6xl">
              Connecting <span className="text-primary">farms</span> to <span className="text-accent">markets.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Fruit &amp; Veg is an agricultural-based company committed to growing farm produce
              and connecting people directly to fresh, healthy, and affordable food — bridging
              the gap between farmers, retailers, wholesalers, and consumers.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/30 to-primary/20 blur-2xl" />
            <img
              src={aboutHero}
              alt="Farmer holding a basket of fresh produce"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-glow)]"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-8 md:py-28">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Our story</span>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">A reliable agricultural supply chain.</h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Our company specializes in the sourcing, packaging, processing, storage, and
            distribution of premium fruits, vegetables, and other agricultural products. Through
            strategic partnerships with farmers and agricultural stakeholders, we ensure customers
            receive fresh produce while farmers gain better market access and fair value for their
            harvests.
          </p>
          <p>
            Beyond growth and produce supply, Fruit &amp; Veg is focused on advancing agricultural
            investment opportunities, supporting food security, reducing post-harvest losses
            through modern storage solutions, and promoting agro-processing for long-term
            sustainability.
          </p>
          <p>
            With our signature product labeling and quality assurance standards, we are building a
            trusted agricultural brand recognized for freshness, reliability, and excellence.
          </p>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Eye size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-bold md:text-3xl">Our Vision</h3>
              <p className="mt-4 leading-relaxed text-primary-foreground/85">
                To become a leading agricultural solutions and produce distribution company
                recognized for transforming farm produce supply, empowering farmers, and delivering
                fresh, quality agricultural products across local and international markets.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-12">
            <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Target size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-bold md:text-3xl">Our Mission</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To provide fresh and high-quality agricultural products through efficient
                farm-to-customer connections while promoting sustainable agriculture, agricultural
                investment, storage innovation, and value-added processing solutions that benefit
                farmers, businesses, and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Core values</span>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What we stand for.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Positioning */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center md:px-8 md:py-28">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Brand positioning</span>
        <p className="mt-6 font-display text-3xl font-bold leading-snug md:text-4xl lg:text-5xl">
          Fruit &amp; Veg is more than a produce supplier — we are a complete agricultural
          solutions company connecting <span className="text-primary">farms</span> to{" "}
          <span className="text-accent">markets</span> through innovation, freshness,
          sustainability, and value creation.
        </p>
        <div className="mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110"
          >
            Explore our services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
