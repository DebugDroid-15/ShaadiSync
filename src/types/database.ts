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
export type EventTypeEnum = "roka" | "haldi" | "mehendi" | "sangeet" | "ceremony" | "reception" | "custom";
export type GuestSideEnum = "bride" | "groom" | "mutual";
export type GuestCategoryEnum = "family" | "close_friend" | "colleague" | "vip";
export type AgeGroupEnum = "adult" | "child";
export type DietaryPrefEnum = "veg" | "jain" | "non_veg" | "vegan";
export type InvitationStatusEnum = "invited" | "declined" | "confirmed" | "tentative";

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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          address: string;
          city: string;
          google_maps_url: string | null;
          contact_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          address: string;
          city: string;
          google_maps_url?: string | null;
          contact_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          address?: string;
          city?: string;
          google_maps_url?: string | null;
          contact_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          wedding_id: string;
          venue_id: string | null;
          name: string;
          event_type: EventTypeEnum;
          start_time: string;
          end_time: string;
          guest_capacity: number;
          dress_code: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          venue_id?: string | null;
          name: string;
          event_type?: EventTypeEnum;
          start_time: string;
          end_time: string;
          guest_capacity?: number;
          dress_code?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          venue_id?: string | null;
          name?: string;
          event_type?: EventTypeEnum;
          start_time?: string;
          end_time?: string;
          guest_capacity?: number;
          dress_code?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      households: {
        Row: {
          id: string;
          wedding_id: string;
          family_name: string;
          primary_contact_name: string;
          phone: string | null;
          email: string | null;
          city: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          family_name: string;
          primary_contact_name: string;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          family_name?: string;
          primary_contact_name?: string;
          phone?: string | null;
          email?: string | null;
          city?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guests: {
        Row: {
          id: string;
          wedding_id: string;
          household_id: string | null;
          first_name: string;
          last_name: string;
          side: GuestSideEnum;
          category: GuestCategoryEnum;
          age_group: AgeGroupEnum;
          phone: string | null;
          email: string | null;
          dietary_pref: DietaryPrefEnum;
          allergies_notes: string | null;
          is_vip: boolean;
          invitation_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          household_id?: string | null;
          first_name: string;
          last_name: string;
          side?: GuestSideEnum;
          category?: GuestCategoryEnum;
          age_group?: AgeGroupEnum;
          phone?: string | null;
          email?: string | null;
          dietary_pref?: DietaryPrefEnum;
          allergies_notes?: string | null;
          is_vip?: boolean;
          invitation_token: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          household_id?: string | null;
          first_name?: string;
          last_name?: string;
          side?: GuestSideEnum;
          category?: GuestCategoryEnum;
          age_group?: AgeGroupEnum;
          phone?: string | null;
          email?: string | null;
          dietary_pref?: DietaryPrefEnum;
          allergies_notes?: string | null;
          is_vip?: boolean;
          invitation_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_invitations: {
        Row: {
          id: string;
          event_id: string;
          guest_id: string;
          status: InvitationStatusEnum;
          invited_at: string;
          responded_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          guest_id: string;
          status?: InvitationStatusEnum;
          invited_at?: string;
          responded_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          guest_id?: string;
          status?: InvitationStatusEnum;
          invited_at?: string;
          responded_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
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
      event_type_enum: EventTypeEnum;
      guest_side_enum: GuestSideEnum;
      guest_category_enum: GuestCategoryEnum;
      age_group_enum: AgeGroupEnum;
      dietary_pref_enum: DietaryPrefEnum;
      invitation_status_enum: InvitationStatusEnum;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
