import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Fresh from farm to you. We connect farms to markets through innovation,
            freshness, sustainability, and value creation.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Products</Link></li>
            <li><Link to="/membership" className="hover:text-foreground">Membership</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span><span className="font-medium text-foreground">Head Office:</span><br />Lagos, Nigeria</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span><span className="font-medium text-foreground">Farm:</span><br />Araromi-Owu, Ikire Apomu, Osun State</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="mailto:fruitvegfarm@gmail.com" className="hover:text-foreground">fruitvegfarm@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Fruit&amp;Veg. All rights reserved.</p>
          <p>Fresh From Farm to You</p>
        </div>
      </div>
    </footer>
  );
}
