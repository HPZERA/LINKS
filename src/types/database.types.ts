export type LinkStatus = "active" | "inactive";
export type UserRole = "admin" | "manager" | "user";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          slug: string;
          destination_url: string;
          description: string | null;
          category_id: string | null;
          status: LinkStatus;
          click_count: number;
          last_clicked_at: string | null;
          password: string | null;
          expires_at: string | null;
          max_clicks: number | null;
          priority: number;
          rotation_weight: number;
          qr_code_url: string | null;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          destination_url: string;
          description?: string | null;
          category_id?: string | null;
          status?: LinkStatus;
          click_count?: number;
          last_clicked_at?: string | null;
          password?: string | null;
          expires_at?: string | null;
          max_clicks?: number | null;
          priority?: number;
          rotation_weight?: number;
          qr_code_url?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          destination_url?: string;
          description?: string | null;
          category_id?: string | null;
          status?: LinkStatus;
          click_count?: number;
          last_clicked_at?: string | null;
          password?: string | null;
          expires_at?: string | null;
          max_clicks?: number | null;
          priority?: number;
          rotation_weight?: number;
          qr_code_url?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          referer: string | null;
          user_agent: string | null;
          device: string | null;
          browser: string | null;
          os: string | null;
          country: string | null;
          ip: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          referer?: string | null;
          user_agent?: string | null;
          device?: string | null;
          browser?: string | null;
          os?: string | null;
          country?: string | null;
          ip?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string;
          referer?: string | null;
          user_agent?: string | null;
          device?: string | null;
          browser?: string | null;
          os?: string | null;
          country?: string | null;
          ip?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clicks_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          id: number;
          site_title: string;
          primary_domain: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          meta_pixel_id: string | null;
          meta_access_token: string | null;
          meta_test_event_code: string | null;
          google_analytics_id: string | null;
          google_tag_manager_id: string | null;
          webhook_url: string | null;
          support_email: string | null;
          default_redirect: string | null;
          store_ip_address: boolean;
          updated_at: string;
        };
        Insert: {
          id?: number;
          site_title?: string;
          primary_domain?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          meta_pixel_id?: string | null;
          meta_access_token?: string | null;
          meta_test_event_code?: string | null;
          google_analytics_id?: string | null;
          google_tag_manager_id?: string | null;
          webhook_url?: string | null;
          support_email?: string | null;
          default_redirect?: string | null;
          store_ip_address?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: number;
          site_title?: string;
          primary_domain?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          meta_pixel_id?: string | null;
          meta_access_token?: string | null;
          meta_test_event_code?: string | null;
          google_analytics_id?: string | null;
          google_tag_manager_id?: string | null;
          webhook_url?: string | null;
          support_email?: string | null;
          default_redirect?: string | null;
          store_ip_address?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      links_public: {
        Row: {
          slug: string;
          destination_url: string;
          status: LinkStatus;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      link_status: LinkStatus;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
