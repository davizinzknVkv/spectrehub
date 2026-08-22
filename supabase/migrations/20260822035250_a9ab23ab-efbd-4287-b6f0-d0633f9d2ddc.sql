CREATE TABLE public.spotify_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url text NOT NULL,
    label text,
    created_at timestamptz DEFAULT now(),
    active boolean DEFAULT true
);

GRANT SELECT ON public.spotify_links TO authenticated;
GRANT ALL ON public.spotify_links TO service_role;

ALTER TABLE public.spotify_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users" 
ON public.spotify_links FOR SELECT 
TO authenticated 
USING (true);
