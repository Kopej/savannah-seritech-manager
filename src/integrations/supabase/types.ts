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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          file_url: string | null
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          file_url?: string | null
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          file_url?: string | null
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      drone_images: {
        Row: {
          captured_at: string
          created_at: string
          id: string
          image_url: string
          notes: string | null
          plot_id: string
        }
        Insert: {
          captured_at?: string
          created_at?: string
          id?: string
          image_url: string
          notes?: string | null
          plot_id: string
        }
        Update: {
          captured_at?: string
          created_at?: string
          id?: string
          image_url?: string
          notes?: string | null
          plot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drone_images_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      lease_payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          paid_date: string | null
          plot_id: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          paid_date?: string | null
          plot_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          paid_date?: string | null
          plot_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lease_payments_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      plots: {
        Row: {
          acreage: number
          annual_budget: number | null
          bed_length: number | null
          created_at: string
          crop_variety: string | null
          id: string
          irrigation_status: string | null
          latitude: number
          lease_end_date: string | null
          lease_start_date: string | null
          longitude: number
          name: string
          next_payment_date: string | null
          number_of_beds: number | null
          plot_perimeter: number | null
          soil_type: string | null
          updated_at: string
        }
        Insert: {
          acreage: number
          annual_budget?: number | null
          bed_length?: number | null
          created_at?: string
          crop_variety?: string | null
          id?: string
          irrigation_status?: string | null
          latitude: number
          lease_end_date?: string | null
          lease_start_date?: string | null
          longitude: number
          name: string
          next_payment_date?: string | null
          number_of_beds?: number | null
          plot_perimeter?: number | null
          soil_type?: string | null
          updated_at?: string
        }
        Update: {
          acreage?: number
          annual_budget?: number | null
          bed_length?: number | null
          created_at?: string
          crop_variety?: string | null
          id?: string
          irrigation_status?: string | null
          latitude?: number
          lease_end_date?: string | null
          lease_start_date?: string | null
          longitude?: number
          name?: string
          next_payment_date?: string | null
          number_of_beds?: number | null
          plot_perimeter?: number | null
          soil_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string
          cost: number | null
          created_at: string
          description: string | null
          id: string
          plot_id: string
          task_type: Database["public"]["Enums"]["task_type"]
          workers_count: number | null
        }
        Insert: {
          completed_at?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          plot_id: string
          task_type: Database["public"]["Enums"]["task_type"]
          workers_count?: number | null
        }
        Update: {
          completed_at?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          plot_id?: string
          task_type?: Database["public"]["Enums"]["task_type"]
          workers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_expenses: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          plot_id: string
          week_ending: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          plot_id: string
          week_ending: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          plot_id?: string
          week_ending?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_expenses_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_type:
        | "pruning"
        | "weeding"
        | "fertilizing"
        | "leaf_harvesting"
        | "pest_control"
        | "irrigation"
        | "soil_preparation"
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
      task_type: [
        "pruning",
        "weeding",
        "fertilizing",
        "leaf_harvesting",
        "pest_control",
        "irrigation",
        "soil_preparation",
      ],
    },
  },
} as const
