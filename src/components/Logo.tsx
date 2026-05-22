import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight text-2xl md:text-[1.75rem] ${className}`}>
      <img src={logoMark} alt="Fruit & Veg logo" className="h-8 w-8 md:h-9 md:w-9 rounded-md object-contain" />
      <span className="leading-none">
        <span className="text-primary">Fruit</span>
        <span className="text-accent">&amp;</span>
        <span className="text-primary">Veg</span>
      </span>
    </Link>
  );
}
