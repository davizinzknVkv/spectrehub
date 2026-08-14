CREATE OR REPLACE FUNCTION public.is_site_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _user_id IS NULL OR _user_id IS DISTINCT FROM auth.uid() THEN false
    ELSE EXISTS (SELECT 1 FROM public.site_admins sa WHERE sa.user_id = _user_id)
  END
$$;

REVOKE ALL ON FUNCTION public.is_site_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_site_admin(uuid) TO authenticated, service_role;