import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SitePlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  cta: string;
  highlight: boolean;
  features: string[];
  role_ids: string[];
  sort: number;
  active: boolean;
};

export type SitePreview = {
  id: string;
  product_id: string;
  title: string;
  description: string;
  image_url: string;
  sort: number;
  active: boolean;
};

export type OptimizerSettings = {
  id: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  status: string;
  active: boolean;
};

export type OptimizerFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort: number;
  active: boolean;
};

export type OptimizerPreview = {
  id: string;
  image_url: string;
  title: string;
  description: string;
  sort: number;
  active: boolean;
};

/** Planos publicados pelo painel admin (leitura pública). */
export function useSitePlans() {
  const [plans, setPlans] = useState<SitePlan[] | null>(null);
  useEffect(() => {
    let alive = true;
    supabase
      .from("site_plans")
      .select("*")
      .eq("active", true)
      .order("sort")
      .then(({ data }) => {
        if (alive && data) setPlans(data as unknown as SitePlan[]);
      });
    return () => {
      alive = false;
    };
  }, []);
  return plans;
}

/** Prévias publicadas pelo painel admin (leitura pública). */
export function useSitePreviews() {
  const [previews, setPreviews] = useState<SitePreview[]>([]);
  useEffect(() => {
    let alive = true;
    supabase
      .from("site_previews")
      .select("*")
      .eq("active", true)
      .order("sort")
      .then(({ data }) => {
        if (alive && data) setPreviews(data as unknown as SitePreview[]);
      });
    return () => {
      alive = false;
    };
  }, []);
  return previews;
}

/** Configurações do Spectre Optimizer. */
export function useOptimizerContent() {
  const [settings, setSettings] = useState<OptimizerSettings | null>(null);
  const [features, setFeatures] = useState<OptimizerFeature[]>([]);
  const [previews, setPreviews] = useState<OptimizerPreview[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.from("optimizer_settings").select("*").eq("active", true).single(),
      supabase.from("optimizer_features").select("*").eq("active", true).order("sort"),
      supabase.from("optimizer_previews").select("*").eq("active", true).order("sort"),
    ]).then(([s, f, p]) => {
      if (!alive) return;
      if (s.data) setSettings(s.data as unknown as OptimizerSettings);
      if (f.data) setFeatures(f.data as unknown as OptimizerFeature[]);
      if (p.data) setPreviews(p.data as unknown as OptimizerPreview[]);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { settings, features, previews };
}

