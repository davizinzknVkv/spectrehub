ALTER TABLE public.spotify_links ADD COLUMN IF NOT EXISTS stock integer DEFAULT 100;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.spotify_links TO authenticated;
GRANT ALL ON public.spotify_links TO service_role;
