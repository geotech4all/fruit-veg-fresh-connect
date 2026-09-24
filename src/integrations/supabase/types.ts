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
      expenses: {
        Row: {
          amount_ngn: number
          category: string
          created_at: string
          description: string
          id: string
          product_id: string | null
          recorded_by: string | null
          spent_on: string
        }
        Insert: {
          amount_ngn: number
          category?: string
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          recorded_by?: string | null
          spent_on?: string
        }
        Update: {
          amount_ngn?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          recorded_by?: string | null
          spent_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          interests: string[]
          location: string | null
          newsletter: boolean
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          interests?: string[]
          location?: string | null
          newsletter?: boolean
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interests?: string[]
          location?: string | null
          newsletter?: boolean
          phone?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          line_total_ngn: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price_ngn: number
          variant_id: string | null
          variant_label: string
        }
        Insert: {
          id?: string
          line_total_ngn: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price_ngn: number
          variant_id?: string | null
          variant_label: string
        }
        Update: {
          id?: string
          line_total_ngn?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price_ngn?: number
          variant_id?: string | null
          variant_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          delivery_address: string
          discount_ngn: number
          email: string | null
          gift_meal_guide: boolean
          health_consultation: boolean
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          payment_status: string
          phone: string
          state: string | null
          status: string
          subtotal_ngn: number
          total_ngn: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          delivery_address: string
          discount_ngn?: number
          email?: string | null
          gift_meal_guide?: boolean
          health_consultation?: boolean
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string
          phone: string
          state?: string | null
          status?: string
          subtotal_ngn: number
          total_ngn: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          delivery_address?: string
          discount_ngn?: number
          email?: string | null
          gift_meal_guide?: boolean
          health_consultation?: boolean
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string
          phone?: string
          state?: string | null
          status?: string
          subtotal_ngn?: number
          total_ngn?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_ngn: number
          id: string
          method: string
          note: string | null
          order_id: string
          paid_at: string
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount_ngn: number
          id?: string
          method?: string
          note?: string | null
          order_id: string
          paid_at?: string
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount_ngn?: number
          id?: string
          method?: string
          note?: string | null
          order_id?: string
          paid_at?: string
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          cost_price_ngn: number
          created_at: string
          id: string
          in_stock: boolean
          label: string
          price_ngn: number
          product_id: string
          sort_order: number
          stock_qty: number
        }
        Insert: {
          cost_price_ngn?: number
          created_at?: string
          id?: string
          in_stock?: boolean
          label: string
          price_ngn: number
          product_id: string
          sort_order?: number
          stock_qty?: number
        }
        Update: {
          cost_price_ngn?: number
          created_at?: string
          id?: string
          in_stock?: boolean
          label?: string
          price_ngn?: number
          product_id?: string
          sort_order?: number
          stock_qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bulk_available: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          bulk_available?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          bulk_available?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          change: number
          created_at: string
          id: string
          note: string | null
          reason: string
          recorded_by: string | null
          unit_cost_ngn: number | null
          variant_id: string
        }
        Insert: {
          change: number
          created_at?: string
          id?: string
          note?: string | null
          reason?: string
          recorded_by?: string | null
          unit_cost_ngn?: number | null
          variant_id: string
        }
        Update: {
          change?: number
          created_at?: string
          id?: string
          note?: string | null
          reason?: string
          recorded_by?: string | null
          unit_cost_ngn?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_team_invite: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "customer"],
    },
  },
} as const
