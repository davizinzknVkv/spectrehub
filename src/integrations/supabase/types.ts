export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      discord_accounts: {
        Row: {
          created_at: string
          discord_global_name: string | null
          discord_user_id: string | null
          discord_username: string | null
          id: string
          last_orbs: number | null
          last_synced_at: string | null
          token_ciphertext: string
          token_iv: string
          updated_at: string
          user_agent: string
          user_id: string
          x_super_properties: string
        }
        Insert: {
          created_at?: string
          discord_global_name?: string | null
          discord_user_id?: string | null
          discord_username?: string | null
          id?: string
          last_orbs?: number | null
          last_synced_at?: string | null
          token_ciphertext: string
          token_iv: string
          updated_at?: string
          user_agent: string
          user_id: string
          x_super_properties: string
        }
        Update: {
          created_at?: string
          discord_global_name?: string | null
          discord_user_id?: string | null
          discord_username?: string | null
          id?: string
          last_orbs?: number | null
          last_synced_at?: string | null
          token_ciphertext?: string
          token_iv?: string
          updated_at?: string
          user_agent?: string
          user_id?: string
          x_super_properties?: string
        }
        Relationships: []
      }
      optimizer_features: {
        Row: {
          active: boolean
          created_at: string | null
          description: string
          icon: string
          id: string
          sort: number
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          description: string
          icon: string
          id?: string
          sort?: number
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          sort?: number
          title?: string
        }
        Relationships: []
      }
      optimizer_previews: {
        Row: {
          active: boolean
          created_at: string | null
          description: string
          id: string
          image_url: string
          sort: number
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          sort?: number
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          sort?: number
          title?: string
        }
        Relationships: []
      }
      optimizer_settings: {
        Row: {
          active: boolean
          badge: string
          button_link: string
          button_text: string
          description: string
          id: string
          name: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          badge?: string
          button_link?: string
          button_text?: string
          description?: string
          id?: string
          name?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          badge?: string
          button_link?: string
          button_text?: string
          description?: string
          id?: string
          name?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quest_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          quest_id: string
          quest_name: string
          reward_text: string | null
          started_at: string
          status: string
          task_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          quest_id: string
          quest_name: string
          reward_text?: string | null
          started_at?: string
          status: string
          task_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          quest_id?: string
          quest_name?: string
          reward_text?: string | null
          started_at?: string
          status?: string
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      site_admins: {
        Row: {
          created_at: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_features: {
        Row: {
          allowed_role_ids: string[]
          created_at: string
          enabled: boolean
          id: string
          key: string
          label: string
          path: string
          price: string
          sort: number
          updated_at: string
        }
        Insert: {
          allowed_role_ids?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          key: string
          label: string
          path?: string
          price?: string
          sort?: number
          updated_at?: string
        }
        Update: {
          allowed_role_ids?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          key?: string
          label?: string
          path?: string
          price?: string
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_plans: {
        Row: {
          active: boolean
          created_at: string
          cta: string
          features: string[]
          highlight: boolean
          id: string
          name: string
          period: string
          price: string
          role_ids: string[]
          sort: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta?: string
          features?: string[]
          highlight?: boolean
          id?: string
          name: string
          period?: string
          price?: string
          role_ids?: string[]
          sort?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta?: string
          features?: string[]
          highlight?: boolean
          id?: string
          name?: string
          period?: string
          price?: string
          role_ids?: string[]
          sort?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_previews: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          image_url: string
          product_id: string
          sort: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url: string
          product_id: string
          sort?: number
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          product_id?: string
          sort?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      spotify_links: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          label: string | null
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          label?: string | null
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          label?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      site_features_public: {
        Row: {
          enabled: boolean | null
          id: string | null
          key: string | null
          label: string | null
          path: string | null
          price: string | null
          sort: number | null
        }
        Insert: {
          enabled?: boolean | null
          id?: string | null
          key?: string | null
          label?: string | null
          path?: string | null
          price?: string | null
          sort?: number | null
        }
        Update: {
          enabled?: boolean | null
          id?: string | null
          key?: string | null
          label?: string | null
          path?: string | null
          price?: string | null
          sort?: number | null
        }
        Relationships: []
      }
      site_plans_public: {
        Row: {
          active: boolean | null
          cta: string | null
          features: string[] | null
          highlight: boolean | null
          id: string | null
          name: string | null
          period: string | null
          price: string | null
          sort: number | null
        }
        Insert: {
          active?: boolean | null
          cta?: string | null
          features?: string[] | null
          highlight?: boolean | null
          id?: string | null
          name?: string | null
          period?: string | null
          price?: string | null
          sort?: number | null
        }
        Update: {
          active?: boolean | null
          cta?: string | null
          features?: string[] | null
          highlight?: boolean | null
          id?: string | null
          name?: string | null
          period?: string | null
          price?: string | null
          sort?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_site_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
