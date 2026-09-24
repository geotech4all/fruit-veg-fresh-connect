import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  variant_id: string;
  product_slug: string;
  product_name: string;
  label: string;
  price: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (variant_id: string, q: number) => void;
  remove: (variant_id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<Cart | null>(null);
const KEY = "fv-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value: Cart = {
    items,
    add: (it) =>
      setItems((cur) => {
        const ex = cur.find((c) => c.variant_id === it.variant_id);
        if (ex) return cur.map((c) => (c.variant_id === it.variant_id ? { ...c, quantity: c.quantity + it.quantity } : c));
        return [...cur, it];
      }),
    setQty: (id, q) => setItems((cur) => cur.map((c) => (c.variant_id === id ? { ...c, quantity: Math.max(1, q) } : c))),
    remove: (id) => setItems((cur) => cur.filter((c) => c.variant_id !== id)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
