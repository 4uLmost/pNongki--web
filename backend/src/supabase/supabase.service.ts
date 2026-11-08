import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://edlljnfcfynbiarwrzlv.supabase.co';
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbGxqbmZjZnluYmlhcndyemx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjY5MjEsImV4cCI6MjEwODkwMjkyMX0.ejQh_hXS5xlFX9TAWrK5SU5z6wpHf2HLJypP_K7jaZc';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbGxqbmZjZnluYmlhcndyemx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzMyNjkyMSwiZXhwIjoyMTA4OTAyOTIxfQ.JV2rJq5h_wQ8oR44v_TDDIWNsl0ryOqT4sP81rDhFo8';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient | null = null;
  private adminClientInstance: SupabaseClient | null = null;

  getClient(): SupabaseClient {
    if (!this.clientInstance) {
      const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const key = process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
      this.clientInstance = createClient(url, key);
    }
    return this.clientInstance;
  }

  getAdminClient(): SupabaseClient {
    if (!this.adminClientInstance) {
      const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        DEFAULT_SERVICE_ROLE_KEY ||
        DEFAULT_ANON_KEY;
      this.adminClientInstance = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return this.adminClientInstance;
  }
}
