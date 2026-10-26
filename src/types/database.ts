export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrgRole = "owner" | "admin" | "member";
export type WeddingRole = "wedding_lead" | "coordinator" | "checkin_staff" | "viewer";
export type WeddingStatusType = "planning" | "active" | "completed" | "archived";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organisations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          billing_tier: "free" | "pro" | "enterprise";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          billing_tier?: "free" | "pro" | "enterprise";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          billing_tier?: "free" | "pro" | "enterprise";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organisations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      organisation_members: {
        Row: {
          id: string;
          organisation_id: string;
          user_id: string;
          role: OrgRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          user_id: string;
          role?: OrgRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          user_id?: string;
          role?: OrgRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organisation_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      weddings: {
        Row: {
          id: string;
          organisation_id: string;
          title: string;
          slug: string;
          couple_bride_name: string;
          couple_groom_name: string;
          start_date: string;
          end_date: string;
          primary_city: string;
          status: WeddingStatusType;
          total_budget: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation_id: string;
          title: string;
          slug: string;
          couple_bride_name: string;
          couple_groom_name: string;
          start_date: string;
          end_date: string;
          primary_city: string;
          status?: WeddingStatusType;
          total_budget?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organisation_id?: string;
          title?: string;
          slug?: string;
          couple_bride_name?: string;
          couple_groom_name?: string;
          start_date?: string;
          end_date?: string;
          primary_city?: string;
          status?: WeddingStatusType;
          total_budget?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "weddings_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "weddings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      wedding_members: {
        Row: {
          id: string;
          wedding_id: string;
          user_id: string;
          role: WeddingRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          user_id: string;
          role?: WeddingRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          user_id?: string;
          role?: WeddingRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wedding_members_wedding_id_fkey";
            columns: ["wedding_id"];
            isOneToOne: false;
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wedding_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_org_member: {
        Args: { target_org_id: string };
        Returns: boolean;
      };
      is_org_admin: {
        Args: { target_org_id: string };
        Returns: boolean;
      };
      can_access_wedding: {
        Args: { target_wedding_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      org_role: OrgRole;
      wedding_role: WeddingRole;
      wedding_status_type: WeddingStatusType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
