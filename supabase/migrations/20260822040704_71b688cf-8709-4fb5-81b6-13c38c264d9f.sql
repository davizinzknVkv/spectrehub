REVOKE EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) FROM anon;

GRANT EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) TO service_role;
