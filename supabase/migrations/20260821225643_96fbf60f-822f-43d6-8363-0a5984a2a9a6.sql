ALTER VIEW public.site_plans_public SET (security_invoker = on);
ALTER VIEW public.site_features_public SET (security_invoker = on);

CREATE POLICY plans_public_read ON public.site_plans
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY features_public_read ON public.site_features
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT (id, name, price, period, cta, highlight, features, sort, active) ON public.site_plans TO anon, authenticated;
GRANT SELECT (id, key, label, path, enabled, price, sort) ON public.site_features TO anon, authenticated;