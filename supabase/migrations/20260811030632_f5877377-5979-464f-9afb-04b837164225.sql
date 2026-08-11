-- Admin check based on linked Discord account
CREATE OR REPLACE FUNCTION public.is_site_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discord_accounts
    WHERE user_id = _user_id
      AND discord_user_id = '1217795750407442473'
  );
$$;

-- PLANS
CREATE TABLE public.site_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL DEFAULT 'R$ 0',
  period text NOT NULL DEFAULT '',
  cta text NOT NULL DEFAULT 'Assinar',
  highlight boolean NOT NULL DEFAULT false,
  features text[] NOT NULL DEFAULT '{}',
  role_ids text[] NOT NULL DEFAULT '{}',
  sort integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_plans TO authenticated;
GRANT ALL ON public.site_plans TO service_role;
ALTER TABLE public.site_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_public_read" ON public.site_plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_write" ON public.site_plans FOR ALL TO authenticated
  USING (public.is_site_admin(auth.uid())) WITH CHECK (public.is_site_admin(auth.uid()));
CREATE TRIGGER site_plans_updated_at BEFORE UPDATE ON public.site_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PREVIEWS
CREATE TABLE public.site_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  sort integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_previews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_previews TO authenticated;
GRANT ALL ON public.site_previews TO service_role;
ALTER TABLE public.site_previews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "previews_public_read" ON public.site_previews FOR SELECT USING (true);
CREATE POLICY "previews_admin_write" ON public.site_previews FOR ALL TO authenticated
  USING (public.is_site_admin(auth.uid())) WITH CHECK (public.is_site_admin(auth.uid()));
CREATE TRIGGER site_previews_updated_at BEFORE UPDATE ON public.site_previews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FEATURES (tools) + allowed roles
CREATE TABLE public.site_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  path text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  allowed_role_ids text[] NOT NULL DEFAULT '{}',
  price text NOT NULL DEFAULT '',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_features TO authenticated;
GRANT ALL ON public.site_features TO service_role;
ALTER TABLE public.site_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "features_public_read" ON public.site_features FOR SELECT USING (true);
CREATE POLICY "features_admin_write" ON public.site_features FOR ALL TO authenticated
  USING (public.is_site_admin(auth.uid())) WITH CHECK (public.is_site_admin(auth.uid()));
CREATE TRIGGER site_features_updated_at BEFORE UPDATE ON public.site_features
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_plans (name, price, period, cta, highlight, features, sort) VALUES
('Free','R$ 0','para sempre','Começar Grátis',false,ARRAY['3 missões diárias','Cooldown de 10 min','Acesso a todas as quests','Estatísticas locais'],0),
('Premium','R$ 9,90','acesso 30 dias','Obter Acesso Premium',true,ARRAY['Missões ilimitadas','Cooldown reduzido (3 min)','Cargo Premium exclusivo','Suporte prioritário'],1),
('Lifetime','R$ 39,90','pagamento único','Comprar Acesso Vitalício',false,ARRAY['Benefícios Premium vitalícios','Cargo permanente no Discord','Zero mensalidades','Acesso antecipado a betas'],2),
('Booster','Grátis','via server boost','Impulsionar Servidor',false,ARRAY['Missões ilimitadas','Menor cooldown do sistema (1 min)','Cargo Booster automático','Status VIP na comunidade'],3);

INSERT INTO public.site_features (key, label, path, sort) VALUES
('missoes','Missões','/missoes',0),
('farms','Farms','/farms',1),
('history','Histórico','/history',2),
('resgatar','Resgatar Orbs','/resgatar',3),
('nicksgun','Nicks-Gun','/nicksgun',4),
('clone','Clonar Discord','/clone',5),
('spotify','Gerador Spotify','/spotify',6),
('fake','Foto Fake','/fake',7);