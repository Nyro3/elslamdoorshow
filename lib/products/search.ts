import type { SearchTerm } from "./categories";
import type { Product } from "./types";

const DIACRITICS = /[ً-ٰٟـ]/g; // التشكيل والتطويل

/** بيوحّد النص عشان البحث يتجاهل الهمزات والتاء المربوطة والتشكيل والأرقام العربي وحالة الحروف */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/\s+/g, " ")
    .trim();
}

function tokenMatches(haystack: string, token: string): boolean {
  // الرقم لازم يتطابق كرقم كامل: "90" يطابق "90 سم" و"90×200" بس مش "190"
  if (/^\d+$/.test(token)) return new RegExp(`(^|\\D)${token}(\\D|$)`).test(haystack);
  return haystack.includes(token);
}

/** المنتج بيطابق لو كل كلمة في النص موجودة في اسمه أو وصفه (بأي ترتيب) */
export function matchesQuery(product: Product, query: string): boolean {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalize(`${product.name} ${product.description ?? ""}`);
  return tokens.every((t) => tokenMatches(haystack, t));
}

export function matchesTerm(product: Product, term: SearchTerm): boolean {
  return [term.label, ...(term.also ?? [])].some((q) => matchesQuery(product, q));
}

/** بيطبّق زرار الفلتر المختار (لو فيه) وكلمة البحث الحرة مع بعض */
export function filterProducts(products: Product[], term: SearchTerm | null, query: string): Product[] {
  return products.filter((p) => (term === null || matchesTerm(p, term)) && matchesQuery(p, query));
}
