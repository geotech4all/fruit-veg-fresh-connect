import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fruit&Veg" },
      { name: "description", content: "Coming soon: our story, vision, mission, and values." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <ComingSoon title="About" />
    </SiteLayout>
  ),
});

function ComingSoon({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-32 text-center md:px-8">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">This page is being prepared in the next phase.</p>
    </section>
  );
}
