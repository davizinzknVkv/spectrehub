
-- Views back to invoker semantics (no SECURITY DEFINER views)
ALTER VIEW public.site_plans_public SET (security_invoker = on);
ALTER VIEW public.site_features_public SET (security_invoker = on);
ALTER VIEW public.spotify_stock_public SET (security_invoker = on);

-- site_plans: public read allowed, but only non-sensitive columns via column grants
CREATE POLICY plans_public_read ON public.site_plans
  FOR SELECT TO anon, authenticated USING (true);
REVOKE SELECT ON public.site_plans FROM anon, authenticated;
GRANT SELECT (id, name, price, period, cta, highlight, features, sort, active)
  ON public.site_plans TO anon, authenticated;

CREATE POLICY features_public_read ON public.site_features
  FOR SELECT TO anon, authenticated USING (true);
REVOKE SELECT ON public.site_features FROM anon, authenticated;
GRANT SELECT (id, key, label, path, enabled, price, sort)
  ON public.site_features TO anon, authenticated;

-- spotify_links: signed-in users may only aggregate stock columns, never urls
CREATE POLICY spotify_links_stock_read ON public.spotify_links
  FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.spotify_links FROM anon, authenticated;
GRANT SELECT (stock, active) ON public.spotify_links TO authenticated;
