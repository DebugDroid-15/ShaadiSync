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
export type VendorCategoryEnum =
  | "caterer"
  | "decorator"
  | "photographer"
  | "videographer"
  | "makeup"
  | "dj"
  | "priest"
  | "florist"
  | "transport"
  | "venue"
  | "other";
export type VendorBookingStatusEnum = "inquiry" | "quoted" | "booked" | "completed" | "cancelled";
export type MealTypeEnum = "breakfast" | "lunch" | "high_tea" | "dinner";
export type ServiceStyleEnum = "buffet" | "seated_thali" | "cocktail" | "food_stations";
export type ExpenseCategoryEnum =
  | "venue"
  | "catering"
  | "decor"
  | "photography"
  | "entertainment"
  | "attire_makeup"
  | "transport_logistics"
  | "invitations_gifts"
  | "priest_rituals"
  | "miscellaneous";
export type PaymentModeEnum = "bank_transfer" | "upi" | "cash" | "cheque" | "card" | "other";
export type PaymentTypeEnum = "advance" | "milestone" | "final" | "refund" | "correction";
export type VehicleTypeEnum = "sedan" | "suv" | "tempo_traveller" | "mini_bus" | "bus" | "two_wheeler" | "other";
export type ParkingAllocationStatusEnum = "reserved" | "allocated" | "arrived" | "cancelled";
export type TripStatusEnum = "scheduled" | "boarding" | "in_transit" | "completed" | "cancelled";
export type RoomTypeEnum = "standard" | "deluxe" | "suite" | "villa" | "dormitory";
export type RoomStatusEnum = "available" | "occupied" | "blocked" | "maintenance";
export type RoomAllocationStatusEnum = "reserved" | "checked_in" | "checked_out" | "cancelled";

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
          token_revoked: boolean;
          token_expires_at: string | null;
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
          token_revoked?: boolean;
          token_expires_at?: string | null;
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
          token_revoked?: boolean;
          token_expires_at?: string | null;
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
      rsvps: {
        Row: {
          id: string;
          event_invitation_id: string;
          attending: boolean;
          adult_count: number;
          child_count: number;
          dietary_pref: DietaryPrefEnum;
          dietary_notes: string | null;
          accompanying_names: string | null;
          submitted_at: string;
          updated_at: string;
          ip_hash: string | null;
        };
        Insert: {
          id?: string;
          event_invitation_id: string;
          attending: boolean;
          adult_count?: number;
          child_count?: number;
          dietary_pref?: DietaryPrefEnum;
          dietary_notes?: string | null;
          accompanying_names?: string | null;
          submitted_at?: string;
          updated_at?: string;
          ip_hash?: string | null;
        };
        Update: {
          id?: string;
          event_invitation_id?: string;
          attending?: boolean;
          adult_count?: number;
          child_count?: number;
          dietary_pref?: DietaryPrefEnum;
          dietary_notes?: string | null;
          accompanying_names?: string | null;
          submitted_at?: string;
          updated_at?: string;
          ip_hash?: string | null;
        };
        Relationships: [];
      };
      vendors: {
        Row: {
          id: string;
          wedding_id: string;
          business_name: string;
          category: VendorCategoryEnum;
          contact_name: string;
          phone: string | null;
          email: string | null;
          booking_status: VendorBookingStatusEnum;
          quoted_price: number;
          agreed_price: number;
          advance_paid: number;
          balance_due: number;
          payment_due_date: string | null;
          arrival_time: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          business_name: string;
          category?: VendorCategoryEnum;
          contact_name: string;
          phone?: string | null;
          email?: string | null;
          booking_status?: VendorBookingStatusEnum;
          quoted_price?: number;
          agreed_price?: number;
          advance_paid?: number;
          payment_due_date?: string | null;
          arrival_time?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          business_name?: string;
          category?: VendorCategoryEnum;
          contact_name?: string;
          phone?: string | null;
          email?: string | null;
          booking_status?: VendorBookingStatusEnum;
          quoted_price?: number;
          agreed_price?: number;
          advance_paid?: number;
          payment_due_date?: string | null;
          arrival_time?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vendor_assignments: {
        Row: {
          id: string;
          vendor_id: string;
          event_id: string;
          service_description: string | null;
          arrival_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          event_id: string;
          service_description?: string | null;
          arrival_time?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          event_id?: string;
          service_description?: string | null;
          arrival_time?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      meal_plans: {
        Row: {
          id: string;
          event_id: string;
          vendor_id: string | null;
          meal_type: MealTypeEnum;
          service_style: ServiceStyleEnum;
          menu_description: string | null;
          planned_per_plate_cost: number;
          buffer_percentage: number;
          is_guarantee_approved: boolean;
          approved_guarantee_headcount: number | null;
          approved_by: string | null;
          approved_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          vendor_id?: string | null;
          meal_type?: MealTypeEnum;
          service_style?: ServiceStyleEnum;
          menu_description?: string | null;
          planned_per_plate_cost?: number;
          buffer_percentage?: number;
          is_guarantee_approved?: boolean;
          approved_guarantee_headcount?: number | null;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          vendor_id?: string | null;
          meal_type?: MealTypeEnum;
          service_style?: ServiceStyleEnum;
          menu_description?: string | null;
          planned_per_plate_cost?: number;
          buffer_percentage?: number;
          is_guarantee_approved?: boolean;
          approved_guarantee_headcount?: number | null;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      budget_allocations: {
        Row: {
          id: string;
          wedding_id: string;
          event_id: string | null;
          category: ExpenseCategoryEnum;
          allocated_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          event_id?: string | null;
          category: ExpenseCategoryEnum;
          allocated_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          event_id?: string | null;
          category?: ExpenseCategoryEnum;
          allocated_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          wedding_id: string;
          event_id: string | null;
          vendor_id: string | null;
          category: ExpenseCategoryEnum;
          title: string;
          description: string | null;
          estimated_amount: number;
          actual_amount: number;
          is_paid: boolean;
          invoice_number: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          event_id?: string | null;
          vendor_id?: string | null;
          category?: ExpenseCategoryEnum;
          title: string;
          description?: string | null;
          estimated_amount?: number;
          actual_amount?: number;
          is_paid?: boolean;
          invoice_number?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          event_id?: string | null;
          vendor_id?: string | null;
          category?: ExpenseCategoryEnum;
          title?: string;
          description?: string | null;
          estimated_amount?: number;
          actual_amount?: number;
          is_paid?: boolean;
          invoice_number?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          wedding_id: string;
          vendor_id: string | null;
          expense_id: string | null;
          amount: number;
          payment_type: PaymentTypeEnum;
          payment_mode: PaymentModeEnum;
          payment_date: string;
          reference_number: string | null;
          paid_by_name: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          vendor_id?: string | null;
          expense_id?: string | null;
          amount: number;
          payment_type?: PaymentTypeEnum;
          payment_mode?: PaymentModeEnum;
          payment_date?: string;
          reference_number?: string | null;
          paid_by_name?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          vendor_id?: string | null;
          expense_id?: string | null;
          amount?: number;
          payment_type?: PaymentTypeEnum;
          payment_mode?: PaymentModeEnum;
          payment_date?: string;
          reference_number?: string | null;
          paid_by_name?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      financial_audit_logs: {
        Row: {
          id: string;
          wedding_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          old_values: Json | null;
          new_values: Json | null;
          performed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          old_values?: Json | null;
          new_values?: Json | null;
          performed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          entity_type?: string;
          entity_id?: string;
          action?: string;
          old_values?: Json | null;
          new_values?: Json | null;
          performed_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      parking_areas: {
        Row: {
          id: string;
          wedding_id: string;
          event_id: string | null;
          venue_id: string | null;
          name: string;
          location_description: string | null;
          total_capacity: number;
          is_accessible: boolean;
          is_valet_available: boolean;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          event_id?: string | null;
          venue_id?: string | null;
          name: string;
          location_description?: string | null;
          total_capacity?: number;
          is_accessible?: boolean;
          is_valet_available?: boolean;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          event_id?: string | null;
          venue_id?: string | null;
          name?: string;
          location_description?: string | null;
          total_capacity?: number;
          is_accessible?: boolean;
          is_valet_available?: boolean;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      parking_allocations: {
        Row: {
          id: string;
          wedding_id: string;
          parking_area_id: string;
          guest_id: string | null;
          household_id: string | null;
          vehicle_type: VehicleTypeEnum;
          vehicle_registration: string | null;
          driver_name: string | null;
          driver_phone: string | null;
          slot_number: string | null;
          status: ParkingAllocationStatusEnum;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          parking_area_id: string;
          guest_id?: string | null;
          household_id?: string | null;
          vehicle_type?: VehicleTypeEnum;
          vehicle_registration?: string | null;
          driver_name?: string | null;
          driver_phone?: string | null;
          slot_number?: string | null;
          status?: ParkingAllocationStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          parking_area_id?: string;
          guest_id?: string | null;
          household_id?: string | null;
          vehicle_type?: VehicleTypeEnum;
          vehicle_registration?: string | null;
          driver_name?: string | null;
          driver_phone?: string | null;
          slot_number?: string | null;
          status?: ParkingAllocationStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transport_vehicles: {
        Row: {
          id: string;
          wedding_id: string;
          vendor_id: string | null;
          provider_name: string;
          vehicle_type: VehicleTypeEnum;
          registration_number: string | null;
          capacity: number;
          driver_name: string | null;
          driver_phone: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          vendor_id?: string | null;
          provider_name: string;
          vehicle_type?: VehicleTypeEnum;
          registration_number?: string | null;
          capacity?: number;
          driver_name?: string | null;
          driver_phone?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          vendor_id?: string | null;
          provider_name?: string;
          vehicle_type?: VehicleTypeEnum;
          registration_number?: string | null;
          capacity?: number;
          driver_name?: string | null;
          driver_phone?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transport_trips: {
        Row: {
          id: string;
          wedding_id: string;
          vehicle_id: string;
          event_id: string | null;
          title: string;
          origin: string;
          destination: string;
          pickup_point: string | null;
          scheduled_pickup_time: string;
          estimated_arrival_time: string | null;
          status: TripStatusEnum;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          vehicle_id: string;
          event_id?: string | null;
          title: string;
          origin: string;
          destination: string;
          pickup_point?: string | null;
          scheduled_pickup_time: string;
          estimated_arrival_time?: string | null;
          status?: TripStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          vehicle_id?: string;
          event_id?: string | null;
          title?: string;
          origin?: string;
          destination?: string;
          pickup_point?: string | null;
          scheduled_pickup_time?: string;
          estimated_arrival_time?: string | null;
          status?: TripStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transport_passengers: {
        Row: {
          id: string;
          wedding_id: string;
          trip_id: string;
          guest_id: string;
          passenger_count: number;
          pickup_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          trip_id: string;
          guest_id: string;
          passenger_count?: number;
          pickup_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          trip_id?: string;
          guest_id?: string;
          passenger_count?: number;
          pickup_notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      accommodation_properties: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          address: string | null;
          city: string | null;
          contact_person: string | null;
          contact_phone: string | null;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          address?: string | null;
          city?: string | null;
          contact_person?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          address?: string | null;
          city?: string | null;
          contact_person?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          id: string;
          wedding_id: string;
          property_id: string;
          room_number: string;
          room_type: RoomTypeEnum;
          floor: string | null;
          max_occupancy: number;
          status: RoomStatusEnum;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          property_id: string;
          room_number: string;
          room_type?: RoomTypeEnum;
          floor?: string | null;
          max_occupancy?: number;
          status?: RoomStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          property_id?: string;
          room_number?: string;
          room_type?: RoomTypeEnum;
          floor?: string | null;
          max_occupancy?: number;
          status?: RoomStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      room_allocations: {
        Row: {
          id: string;
          wedding_id: string;
          room_id: string;
          guest_id: string | null;
          household_id: string | null;
          occupancy_count: number;
          check_in_date: string;
          check_out_date: string;
          status: RoomAllocationStatusEnum;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          room_id: string;
          guest_id?: string | null;
          household_id?: string | null;
          occupancy_count?: number;
          check_in_date: string;
          check_out_date: string;
          status?: RoomAllocationStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          room_id?: string;
          guest_id?: string | null;
          household_id?: string | null;
          occupancy_count?: number;
          check_in_date?: string;
          check_out_date?: string;
          status?: RoomAllocationStatusEnum;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
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
      get_guest_id_by_token: {
        Args: { token: string };
        Returns: string;
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
      vendor_category_enum: VendorCategoryEnum;
      vendor_booking_status_enum: VendorBookingStatusEnum;
      meal_type_enum: MealTypeEnum;
      service_style_enum: ServiceStyleEnum;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
