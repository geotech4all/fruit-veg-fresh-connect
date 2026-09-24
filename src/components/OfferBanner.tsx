import { CheckCircle2, Gift } from "lucide-react";
import { OFFERS } from "@/lib/pricing";

export function OfferBanner() {
  return (
    <div className="rounded-3xl border border-accent/30 bg-accent/10 p-6 md:p-8">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERS.map((o) => (
          <li key={o} className="flex items-start gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" /> {o}
          </li>
        ))}
      </ul>
      <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
        <Gift size={18} className="mt-0.5 shrink-0 text-accent" />
        Orders confirmed today come with a special healthy meal guide (soft copy) as a gift.
      </p>
    </div>
  );
}
