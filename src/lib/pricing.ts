export const formatNaira = (n: number) => "₦" + n.toLocaleString("en-NG");

export function computeDiscount(subtotal: number) {
  if (subtotal >= 150000) return { discount: 10000, consultation: true };
  if (subtotal >= 70000) return { discount: 5000, consultation: false };
  return { discount: 0, consultation: false };
}

export const OFFERS = [
  "Free delivery nationwide",
  "Payment on delivery",
  "100% money-back guarantee if you find stones or dirt",
  "₦5,000 off orders from ₦70,000",
  "₦10,000 off orders from ₦150,000 + free 30-second health consultation",
];
