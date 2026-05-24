import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ArrowRight, Send, Package, Users, Globe } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/contact")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const ogImage = `${origin}/og-image.jpg`;
    return {
      meta: [
        { title: "Contact — Fruit&Veg" },
        { name: "description", content: "Reach Fruit&Veg for supply requests, partnerships, and export enquiries. Head office in Lagos, farm in Osun State. Email: fruitvegfarm@gmail.com" },
        { property: "og:title", content: "Contact Fruit&Veg" },
        { property: "og:description", content: "Send a supply request or reach Fruit&Veg in Lagos and Osun State." },
        { property: "og:url", content: `${origin}/contact` },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:title", content: "Contact Fruit&Veg" },
        { name: "twitter:description", content: "Send a supply request or reach Fruit&Veg in Lagos and Osun State." },
      ],
    };
  },
  component: Contact,
});

const contactCards = [
  {
    icon: Mail,
    title: "Email",
    color: "primary",
    lines: ["fruitvegfarm@gmail.com"],
    href: "mailto:fruitvegfarm@gmail.com",
    cta: "Send email",
  },
  {
    icon: MapPin,
    title: "Head Office",
    color: "accent",
    lines: ["Lagos, Nigeria"],
    href: undefined,
    cta: undefined,
  },
  {
    icon: MapPin,
    title: "Farm Address",
    color: "primary",
    lines: ["Araromi-Owu, Ikire Apomu", "Osun State, Nigeria"],
    href: undefined,
    cta: undefined,
  },
];

const enquiryTypes = [
  { icon: Package, label: "Fresh Produce Supply", desc: "Retail, wholesale, or bulk orders of okro, pepper, tomato, maize, and more." },
  { icon: Globe, label: "Export Partnership", desc: "International buyers and export companies looking for Nigerian agricultural produce." },
  { icon: Users, label: "Investment & Partnership", desc: "Farm-cycle investment opportunities and strategic agricultural partnerships." },
  { icon: Send, label: "General Enquiry", desc: "Any other questions about our services, farm visits, or collaborations." },
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "Fresh Produce Supply",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Supply Request: ${form.type} — ${form.name}`;
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0AEnquiry Type: ${form.type}%0D%0A%0D%0AMessage:%0D%0A${form.message}`;
    window.location.href = `mailto:fruitvegfarm@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-leaf/70" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">
              <Phone size={14} /> Contact Us
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-primary-foreground md:text-6xl">
              Let's <span className="text-accent">connect.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              For supply requests, export partnerships, investment enquiries, or general questions —
              we are here to respond and build something great together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left: Info cards */}
          <div className="space-y-4 lg:col-span-2">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Reach us</span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Contact details.</h2>
              <p className="mt-3 text-muted-foreground">
                Our team is available to respond to supply requests, partnership enquiries, and export opportunities.
              </p>
            </div>
            {contactCards.map(({ icon: Icon, title, color, lines, href, cta }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <div className="mt-1 space-y-0.5">
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </div>
                {href && cta && (
                  <a href={href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                    {cta} <ArrowRight size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
              <h3 className="text-2xl font-bold">Send a supply request</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in the form below and we will respond to your enquiry as soon as possible.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-all focus:ring-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-all focus:ring-2"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="type" className="mb-1.5 block text-sm font-medium">Enquiry type</label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-all focus:ring-2"
                  >
                    {enquiryTypes.map((t) => (
                      <option key={t.label} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-all focus:ring-2 resize-none"
                    placeholder="Tell us what you need — quantities, timelines, destinations..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
                >
                  <Send size={16} /> Send Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Types Grid */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">How we can help</span>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What are you looking for?</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {enquiryTypes.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Interested in a longer-term partnership?</h2>
            <p className="mt-4 text-primary-foreground/80 md:text-lg">
              Explore membership options and partnership tiers tailored to your business.
            </p>
            <Link
              to="/membership"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:brightness-105"
            >
              View partnership options <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
