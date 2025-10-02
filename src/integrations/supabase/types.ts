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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      barcode_generations: {
        Row: {
          barcode_type: string
          barcode_value: string
          created_at: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          barcode_type: string
          barcode_value: string
          created_at?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          barcode_type?: string
          barcode_value?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barcode_generations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          customization: Json | null
          id: string
          image_url: string | null
          is_digital: boolean | null
          name: string
          price: number
          product_id: string | null
          quantity: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          image_url?: string | null
          is_digital?: boolean | null
          name: string
          price: number
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          image_url?: string | null
          is_digital?: boolean | null
          name?: string
          price?: number
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          code: string
          created_at: string | null
          current_amount: number
          expires_at: string | null
          id: string
          initial_amount: number
          message: string | null
          recipient_email: string | null
          sender_name: string | null
          status: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_amount: number
          expires_at?: string | null
          id?: string
          initial_amount: number
          message?: string | null
          recipient_email?: string | null
          sender_name?: string | null
          status?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_amount?: number
          expires_at?: string | null
          id?: string
          initial_amount?: number
          message?: string | null
          recipient_email?: string | null
          sender_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          status: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
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
        ]
      }
      order_refunds: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          order_id: string
          reason: string | null
          status: string | null
          updated_at: string | null
          ziina_refund_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          ziina_refund_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id?: string
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          ziina_refund_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          id: string
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          status: string | null
          total: number | null
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string | null
          total?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          id: string
          ip_address: string | null
          path: string
          referrer: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          path: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          path?: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          images: Json | null
          is_customizable: boolean | null
          is_digital: boolean | null
          is_featured: boolean | null
          manage_stock: boolean | null
          name: string
          price: number
          short_description: string | null
          sku: string | null
          slug: string | null
          status: string | null
          stock_quantity: number | null
          stock_status: string | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_customizable?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          manage_stock?: boolean | null
          name: string
          price: number
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_customizable?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          manage_stock?: boolean | null
          name?: string
          price?: number
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          reward_earned: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          reward_earned?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          reward_earned?: number | null
          status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          estimated_days: string | null
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      site_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
