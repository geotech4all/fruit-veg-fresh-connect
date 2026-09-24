# Fruit&Veg Shop — Ordering Platform Plan

Turn the site into a working shop: customers browse available produce and order, the team manages products, prices, orders and payments. Built one phase at a time, you approve each before the next.

## Phase A — Backend + Team accounts
- Turn on Lovable Cloud (database + logins).
- Roles: Admin, Team member (staff), Customer. Roles kept in a separate secure table.
- Team members join by **invite only**: admin enters an email, the person gets a link to set their password.
- Sign in page (email/password + Google) for team and customers.

## Phase B — Product catalog (Shop page)
- New **/shop** page listing available products, each with sizes and prices (e.g. 5kg / 10kg / 25kg / 50kg).
- Product page with photos, description, size picker, "Add to order".
- "Signature by Geotech4All" mark on every product card and product page.
- Pre-loaded with your products:
  - Teleios Ofada Rice — 5kg ₦25,000 · 10kg ₦45,000 · 25kg ₦90,000 · 50kg ₦170,000
  - Normal Rice — 5kg ₦8,750 · 10kg ₦17,500 · 25kg ₦35,000 · 50kg ₦70,000
  - Potato Flour 5kg ₦30,000 · Unripe Plantain Flour 5kg ₦35,000 · Oatmeal 5kg ₦30,000
  - Processed Dry Okro (price to confirm)
- "Bulk supply" option: request a custom quote instead of a fixed price.
- Offer banner: free delivery, pay on delivery, money-back guarantee, discount tiers, today-only meal guide gift.

## Phase C — Ordering (cart + checkout)
- Cart, then checkout asking: name, phone, delivery location/address, notes.
- Automatic discounts: ₦5,000 off from ₦70,000; ₦10,000 off from ₦150,000 (+ free health consultation note).
- Payment method: **Pay on delivery** (default).
- Order confirmation page + order number; same-day orders flagged for the free meal guide.
- Guest checkout, or sign in to see order history.

## Phase D — Admin dashboard
- Products: add / edit / hide products, sizes, prices, photos, stock status (Available, Out of stock, Coming soon).
- Orders: list, filter, change status (New → Confirmed → Out for delivery → Delivered / Cancelled).
- Payment tracking: mark each order Unpaid / Paid (cash, transfer) / Refunded, with amount and date; totals summary.
- Team: invite members, remove access.

## Phase E — Membership
- Public "Join membership" form (name, email, phone, location, interests).
- Members get a member discount at checkout and are listed for produce update announcements.
- Admin can view/export members.

## Phase F (later, optional)
- Online card/transfer payments.
- Email notifications (new order to team, confirmation to customer, produce updates to members).
- WhatsApp order button.

## Technical details
- Tables: products, product_variants (size, price, stock), orders, order_items, payments, members, user_roles (+ has_role function), invites. RLS on all; public reads active products only; staff/admin manage via role checks.
- Server functions for checkout (prices and discounts recalculated server-side); admin actions behind auth middleware.
- Admin area in a protected section; new pages get their own SEO meta; sitemap updated.

## Open questions (can answer as we go)
- Dry okro sizes and prices.
- Member discount amount (e.g. fixed 5%)?
- "Geotech4All signature": a small "Powered by Geotech4All" badge, or a specific logo you will send?
