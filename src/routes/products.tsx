import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Fruit&Veg" },
      { name: "description", content: "Coming soon: our full product range." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-32 text-center md:px-8">
        <h1 className="text-5xl font-bold">Products</h1>
        <p className="mt-4 text-muted-foreground">This page is being prepared in the next phase.</p>
      </section>
    </SiteLayout>
  ),
});
