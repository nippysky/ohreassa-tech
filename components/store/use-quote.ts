"use client";

import { useEffect, useState } from "react";
import type { CartItem, Quote } from "@/lib/commerce/types";

export function useQuote(items: CartItem[], ready: boolean) {
  const signature = JSON.stringify(items);
  const [attempt, setAttempt] = useState(0);
  const key = `${signature}:${attempt}`;
  const [result, setResult] = useState<{
    key: string;
    quote?: Quote;
    error?: string;
  }>({ key: "" });
  useEffect(() => {
    if (!ready || signature === "[]") return;
    const controller = new AbortController();
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: JSON.parse(signature) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "We couldn’t check your cart.");
        setResult({ key, quote: data.quote });
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setResult((previous) => ({
            key,
            quote: previous.quote,
            error:
              error.message || "Please check your connection and try again.",
          }));
      });
    return () => controller.abort();
  }, [signature, key, ready]);
  return {
    quote: result.quote,
    error: result.error,
    loading: !ready || (items.length > 0 && result.key !== key),
    retry: () => setAttempt((value) => value + 1),
  };
}
