
CREATE TABLE public.discord_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  token_ciphertext TEXT NOT NULL,
  token_iv TEXT NOT NULL,
  x_super_properties TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  discord_user_id TEXT,
  discord_username TEXT,
  discord_global_name TEXT,
  last_orbs INTEGER,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discord_accounts TO authenticated;
GRANT ALL ON public.discord_accounts TO service_role;
ALTER TABLE public.discord_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_discord_account" ON public.discord_accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.quest_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  quest_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  reward_text TEXT,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quest_runs TO authenticated;
GRANT ALL ON public.quest_runs TO service_role;
ALTER TABLE public.quest_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_quest_runs" ON public.quest_runs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX quest_runs_user_started_idx ON public.quest_runs (user_id, started_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER discord_accounts_updated_at BEFORE UPDATE ON public.discord_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
