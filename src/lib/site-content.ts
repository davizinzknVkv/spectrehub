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
