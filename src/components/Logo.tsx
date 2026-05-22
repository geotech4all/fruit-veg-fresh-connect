import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-baseline font-display font-extrabold tracking-tight text-2xl md:text-[1.75rem] ${className}`}>
      <span className="text-primary">Fruit</span>
      <span className="text-accent">&amp;Veg</span>
      <span className="ml-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
    </Link>
  );
}
