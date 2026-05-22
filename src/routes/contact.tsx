import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Fruit&Veg" },
      { name: "description", content: "Send a supply request or reach Fruit&Veg in Lagos and Osun State." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-24 md:px-8">
        <h1 className="text-5xl font-bold md:text-6xl">Get in touch.</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          For supply requests, partnerships, or general enquiries — we'd love to hear from you.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <h3 className="mt-4 font-semibold">Email</h3>
            <a href="mailto:fruitvegfarm@gmail.com" className="mt-1 block text-sm text-accent hover:underline">
              fruitvegfarm@gmail.com
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <MapPin size={20} />
            </div>
            <h3 className="mt-4 font-semibold">Locations</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Head Office:</span> Lagos, Nigeria<br />
              <span className="font-medium text-foreground">Farm:</span> Araromi-Owu, Ikire Apomu, Osun State
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          A full supply-request form will be added in the next phase.
        </p>
      </section>
    </SiteLayout>
  );
}
