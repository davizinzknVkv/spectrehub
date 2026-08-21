-- 1) Owner-scoped write policies for discord_accounts
CREATE POLICY own_discord_account_insert ON public.discord_accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY own_discord_account_update ON public.discord_accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY own_discord_account_delete ON public.discord_accounts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discord_accounts TO authenticated;
GRANT ALL ON public.discord_accounts TO service_role;

-- 2) Hide internal Discord role IDs from public reads
DROP POLICY IF EXISTS plans_public_read ON public.site_plans;
DROP POLICY IF EXISTS features_public_read ON public.site_features;
REVOKE SELECT ON public.site_plans FROM anon, authenticated;
REVOKE SELECT ON public.site_features FROM anon, authenticated;
GRANT ALL ON public.site_plans TO service_role;
GRANT ALL ON public.site_features TO service_role;

CREATE OR REPLACE VIEW public.site_plans_public AS
  SELECT id, name, price, period, cta, highlight, features, sort, active
  FROM public.site_plans WHERE active = true;

CREATE OR REPLACE VIEW public.site_features_public AS
  SELECT id, key, label, path, enabled, price, sort
  FROM public.site_features;

GRANT SELECT ON public.site_plans_public TO anon, authenticated;
GRANT SELECT ON public.site_features_public TO anon, authenticated;