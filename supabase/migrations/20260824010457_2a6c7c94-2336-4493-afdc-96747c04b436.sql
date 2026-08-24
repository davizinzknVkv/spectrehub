
-- 1) site_plans / site_features: remove public read of role-id config, keep safe public views
ALTER VIEW public.site_plans_public SET (security_invoker = off);
ALTER VIEW public.site_features_public SET (security_invoker = off);

DROP POLICY IF EXISTS plans_public_read ON public.site_plans;
DROP POLICY IF EXISTS features_public_read ON public.site_features;

REVOKE SELECT ON public.site_plans FROM anon;
REVOKE SELECT ON public.site_features FROM anon;

GRANT SELECT ON public.site_plans_public TO anon, authenticated;
GRANT SELECT ON public.site_features_public TO anon, authenticated;

-- 2) spotify_links: no broad authenticated read; expose only aggregated stock
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.spotify_links;

CREATE POLICY spotify_links_admin_read ON public.spotify_links
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()));

CREATE OR REPLACE VIEW public.spotify_stock_public
WITH (security_invoker = off) AS
  SELECT COALESCE(SUM(stock), 0)::bigint AS total_stock
  FROM public.spotify_links
  WHERE active = true;

GRANT SELECT ON public.spotify_stock_public TO anon, authenticated;

-- 3) SECURITY DEFINER function must not be callable by clients
REVOKE ALL ON FUNCTION public.decrement_spotify_stock(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) TO service_role;
