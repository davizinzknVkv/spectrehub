-- Optimizer Settings
CREATE TABLE public.optimizer_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL DEFAULT 'SPECTRE OPTIMIZER',
    badge text NOT NULL DEFAULT 'EM BREVE',
    title text NOT NULL DEFAULT 'Maximum Performance. Zero Compromise.',
    description text NOT NULL DEFAULT 'Uma nova geração de otimização focada em performance, estabilidade e experiência gamer.',
    button_text text NOT NULL DEFAULT 'CONHECER O OPTIMIZER',
    button_link text NOT NULL DEFAULT 'https://discord.gg/JK7cC9je87',
    status text NOT NULL DEFAULT 'Em breve', -- Em breve, Disponível, Atualizando, Indisponível
    active boolean NOT NULL DEFAULT true,
    updated_at timestamptz DEFAULT now()
);

-- Optimizer Features
CREATE TABLE public.optimizer_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    icon text NOT NULL, -- Lucide icon name
    title text NOT NULL,
    description text NOT NULL,
    sort integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Optimizer Previews (Screenshots)
CREATE TABLE public.optimizer_previews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    sort integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Grants
GRANT SELECT ON public.optimizer_settings TO authenticated, anon;
GRANT ALL ON public.optimizer_settings TO service_role;

GRANT SELECT ON public.optimizer_features TO authenticated, anon;
GRANT ALL ON public.optimizer_features TO service_role;

GRANT SELECT ON public.optimizer_previews TO authenticated, anon;
GRANT ALL ON public.optimizer_previews TO service_role;

-- RLS
ALTER TABLE public.optimizer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimizer_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimizer_previews ENABLE ROW LEVEL SECURITY;

-- Policies for public read
CREATE POLICY "Allow public read on optimizer_settings" ON public.optimizer_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on optimizer_features" ON public.optimizer_features FOR SELECT USING (true);
CREATE POLICY "Allow public read on optimizer_previews" ON public.optimizer_previews FOR SELECT USING (true);

-- Admin write policies (using site_admins check)
CREATE POLICY "Allow admin manage optimizer_settings" ON public.optimizer_settings
FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM site_admins WHERE user_id = auth.uid()));

CREATE POLICY "Allow admin manage optimizer_features" ON public.optimizer_features
FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM site_admins WHERE user_id = auth.uid()));

CREATE POLICY "Allow admin manage optimizer_previews" ON public.optimizer_previews
FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM site_admins WHERE user_id = auth.uid()));

-- Insert default settings
INSERT INTO public.optimizer_settings (name, badge, title, description, button_text, button_link, status)
VALUES ('SPECTRE OPTIMIZER', 'EM BREVE', 'Maximum Performance. Zero Compromise.', 'Uma nova geração de otimização focada em performance, estabilidade e experiência gamer.', 'CONHECER O OPTIMIZER', 'https://discord.gg/JK7cC9je87', 'Em breve');

-- Insert default features
INSERT INTO public.optimizer_features (icon, title, description, sort) VALUES
('Zap', 'Performance', 'Otimize seu sistema para extrair o máximo desempenho.', 0),
('Target', 'Game Boost', 'Ajustes focados em jogos e redução de processos desnecessários.', 1),
('Gauge', 'FPS Boost', 'Configurações voltadas para melhorar estabilidade e desempenho.', 2),
('Globe', 'Network', 'Otimizações de rede para uma experiência mais estável.', 3),
('Trash2', 'System Cleaner', 'Limpeza de arquivos temporários e dados desnecessários.', 4),
('Activity', 'Live Monitor', 'Acompanhe o desempenho do sistema em tempo real.', 5);