-- Allow users to read only their own admin row (used by policies below)
GRANT SELECT ON public.site_admins TO authenticated;
GRANT ALL ON public.site_admins TO service_role;

DROP POLICY IF EXISTS site_admins_select_self ON public.site_admins;
CREATE POLICY site_admins_select_self ON public.site_admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Replace function usage in policies with a direct, RLS-protected lookup
DROP POLICY IF EXISTS plans_admin_write ON public.site_plans;
CREATE POLICY plans_admin_write ON public.site_plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()));

DROP POLICY IF EXISTS previews_admin_write ON public.site_previews;
CREATE POLICY previews_admin_write ON public.site_previews
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()));

DROP POLICY IF EXISTS features_admin_write ON public.site_features;
CREATE POLICY features_admin_write ON public.site_features
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()));

-- Signed-in users no longer need to execute the SECURITY DEFINER helper
REVOKE ALL ON FUNCTION public.is_site_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_site_admin(uuid) TO service_role;