import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let client: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Client com a service role key — ignora RLS. Uso restrito ao servidor
 * (Server Actions, route handlers, o bloco waitUntil do middleware).
 * Nunca importar isso de um Client Component.
 */
export function getServiceRoleClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local",
    );
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return client;
}
