-- 1. Separate, non-user-writable admin allowlist
CREATE TABLE IF NOT EXISTS public.site_admins (
  user_id uuid PRIMARY KEY,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.site_admins TO service_role;
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;
-- no policies: unreachable via Data API; only service role / definer functions

-- Seed from any existing linked owner account (currently none)
INSERT INTO public.site_admins (user_id, note)
SELECT DISTINCT user_id, 'owner discord 1217795750407442473'
FROM public.discord_accounts
WHERE discord_user_id = '1217795750407442473'
ON CONFLICT (user_id) DO NOTHING;

-- 2. is_site_admin no longer trusts user-writable discord_accounts
CREATE OR REPLACE FUNCTION public.is_site_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = _user_id);
$function$;

-- 3. Lock down discord_accounts: tokens and identity columns are not client-reachable
DROP POLICY IF EXISTS own_discord_account ON public.discord_accounts;
REVOKE ALL ON public.discord_accounts FROM anon, authenticated;
GRANT ALL ON public.discord_accounts TO service_role;

CREATE POLICY "own_discord_account_read" ON public.discord_accounts
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- read-only, and never the secret material
GRANT SELECT (id, user_id, discord_user_id, discord_username, discord_global_name,
              last_orbs, last_synced_at, created_at, updated_at)
ON public.discord_accounts TO authenticated;

-- 4. Defense in depth: block identity spoofing even if grants widen later
CREATE OR REPLACE FUNCTION public.prevent_discord_identity_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND auth.uid() IS NOT NULL
     AND NEW.discord_user_id IS DISTINCT FROM OLD.discord_user_id THEN
    RAISE EXCEPTION 'discord_user_id cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS discord_accounts_identity_lock ON public.discord_accounts;
CREATE TRIGGER discord_accounts_identity_lock
BEFORE UPDATE ON public.discord_accounts
FOR EACH ROW EXECUTE FUNCTION public.prevent_discord_identity_change();