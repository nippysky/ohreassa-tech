"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cartItemSchema } from "@/lib/commerce/validation";
import { MAX_CART_LINES, MAX_QUANTITY } from "@/lib/commerce/pricing";
import type { CartItem } from "@/lib/commerce/types";

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  add: (id: string, quantity: number) => boolean;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  notice: string;
  announce: (message: string) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "ohreassa-cart-v1";

function readCart(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    return raw.slice(0, MAX_CART_LINES).flatMap((item) => {
      const parsed = cartItemSchema.safeParse(item);
      if (!parsed.success || seen.has(parsed.data.productId)) return [];
      seen.add(parsed.data.productId);
      return [parsed.data];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    // Hydrate after mount so server and first browser render agree. Customer details are never persisted.
    const hydrate = () => {
      setItems(readCart());
      setReady(true);
    };
    hydrate();
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) hydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        /* Shopping still works when storage is unavailable. */
      }
    }
  }, [items, ready]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timeout);
  }, [notice]);
  function add(productId: string, quantity: number) {
    const existing = items.find((item) => item.productId === productId);
    if (
      (!existing && items.length >= MAX_CART_LINES) ||
      (existing?.quantity || 0) + quantity > MAX_QUANTITY
    ) {
      setNotice("For larger orders, please contact our team on WhatsApp.");
      return false;
    }
    setItems((current) =>
      existing
        ? current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...current, { productId, quantity }],
    );
    setNotice("Added to your cart.");
    return true;
  }
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        add,
        update: (id, quantity) =>
          setItems((current) =>
            current.map((item) =>
              item.productId === id
                ? {
                    ...item,
                    quantity: Math.min(
                      MAX_QUANTITY,
                      Math.max(1, Math.trunc(quantity) || 1),
                    ),
                  }
                : item,
            ),
          ),
        remove: (id) =>
          setItems((current) =>
            current.filter((item) => item.productId !== id),
          ),
        clear: () => setItems([]),
        notice,
        announce: setNotice,
      }}
    >
      {children}
      <div
        className={`toast ${notice ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is required");
  return context;
}
