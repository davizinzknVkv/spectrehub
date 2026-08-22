CREATE OR REPLACE FUNCTION public.decrement_spotify_stock(row_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.spotify_links
  SET stock = GREATEST(0, stock - amount)
  WHERE id = row_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.decrement_spotify_stock(uuid, integer) TO authenticated;
