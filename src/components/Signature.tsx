import { BadgeCheck } from "lucide-react";

export function Signature({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary ${className}`}
    >
      <BadgeCheck size={13} className="text-accent" /> Signature by Geotech4All
    </span>
  );
}
