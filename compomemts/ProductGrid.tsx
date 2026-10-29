"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../lib/cart/cartStore";
import { useProducts } from "../lib/products/useProducts";
import { CATEGORY_BY_SLUG } from "../lib/products/categories";
import { filterProducts, matchesTerm } from "../lib/products/search";
import type { CategorySlug } from "../lib/products/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ category }: { category: CategorySlug }) {
  const { products, status, reload } = useProducts(category);
  const { count } = useCart();

  const terms = CATEGORY_BY_SLUG[category].searchTerms;
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const activeTerm = terms.find((t) => t.label === activeLabel) ?? null;
  const filtering = activeTerm !== null || query.trim() !== "";

  const visible = useMemo(() => filterProducts(products, activeTerm, query), [products, activeTerm, query]);

  // عدد المنتجات المطابقة لكل زرار (بيتحسب على كل منتجات القسم)
  const termCounts = useMemo(
    () => Object.fromEntries(terms.map((t) => [t.label, products.filter((p) => matchesTerm(p, t)).length])),
    [terms, products],
  );

  function resetFilters() {
    setActiveLabel(null);
    setQuery("");
  }

  return (
    <>
      {status === "ready" && products.length > 0 && (
        <div className="shop__filterbar">
          <input
            type="search"
            className="shop__search"
            placeholder="ابحث في هذا القسم..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="ابحث في منتجات القسم"
          />

          {terms.length > 0 && (
            <div className="shop__filters" role="group" aria-label="فلتر سريع">
              <button
                type="button"
                className={activeTerm === null ? "shop__filter shop__filter--on" : "shop__filter"}
                aria-pressed={activeTerm === null}
                onClick={() => setActiveLabel(null)}
              >
                الكل ({products.length})
              </button>
              {terms.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={activeLabel === t.label ? "shop__filter shop__filter--on" : "shop__filter"}
                  aria-pressed={activeLabel === t.label}
                  onClick={() => setActiveLabel(activeLabel === t.label ? null : t.label)}
                >
                  {t.label} ({termCounts[t.label] ?? 0})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="shop__toolbar">
        <span>
          {status === "ready"
            ? filtering
              ? `${visible.length} من ${products.length} منتج`
              : `${products.length} منتج`
            : ""}
        </span>
        <Link href="/cart" className="shop__cartlink">
          السلة ({count})
        </Link>
      </div>

      {status === "loading" && <p className="shop__state">جاري التحميل...</p>}

      {status === "error" && (
        <div className="shop__state">
          <p>حصلت مشكلة في تحميل المنتجات.</p>
          <button type="button" className="shop__btn" onClick={reload}>
            حاول تاني
          </button>
        </div>
      )}

      {status === "ready" && products.length === 0 && (
        <p className="shop__state">لا توجد منتجات في هذا القسم حاليًا.</p>
      )}

      {status === "ready" && products.length > 0 && visible.length === 0 && (
        <div className="shop__state">
          <p>مفيش منتجات مطابقة للبحث.</p>
          <button type="button" className="shop__btn" onClick={resetFilters}>
            عرض كل منتجات القسم
          </button>
        </div>
      )}

      {status === "ready" && visible.length > 0 && (
        <div className="shop__grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
