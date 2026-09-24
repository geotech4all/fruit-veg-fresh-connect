export const formatNaira = (n: number) => "₦" + n.toLocaleString("en-NG");

export const DISCOUNT_THRESHOLD = 200000;
export const DISCOUNT_AMOUNT = 10000;

export function computeDiscount(subtotal: number) {
  if (subtotal > DISCOUNT_THRESHOLD) return { discount: DISCOUNT_AMOUNT, consultation: true };
  return { discount: 0, consultation: false };
}

export const OFFERS = [
  "Free delivery nationwide",
  "Orders are confirmed once payment is received",
  "100% money-back guarantee if you find stones or dirt",
  "₦10,000 off orders above ₦200,000 + free 30-second health consultation",
];
