ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS cost_price_ngn integer NOT NULL DEFAULT 0;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS stock_qty integer NOT NULL DEFAULT 0;

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'Production',
  description text NOT NULL,
  amount_ngn integer NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  spent_on date NOT NULL DEFAULT current_date,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team manages expenses" ON public.expenses FOR ALL TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));

CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  change integer NOT NULL,
  reason text NOT NULL DEFAULT 'restock',
  unit_cost_ngn integer,
  note text,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team manages stock" ON public.stock_movements FOR ALL TO authenticated USING (public.is_team(auth.uid())) WITH CHECK (public.is_team(auth.uid()));

CREATE OR REPLACE FUNCTION public.apply_stock_movement() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
begin
  update public.product_variants set stock_qty = stock_qty + new.change,
    cost_price_ngn = coalesce(new.unit_cost_ngn, cost_price_ngn)
  where id = new.variant_id;
  return new;
end $$;
CREATE TRIGGER stock_movements_apply AFTER INSERT ON public.stock_movements FOR EACH ROW EXECUTE FUNCTION public.apply_stock_movement();

CREATE POLICY "Team deletes invites" ON public.team_invites FOR SELECT TO authenticated USING (public.is_team(auth.uid()));