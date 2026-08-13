REVOKE ALL ON FUNCTION public.prevent_discord_identity_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_site_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_site_admin(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;