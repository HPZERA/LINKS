import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local",
    );
  }

  return { url, anonKey };
}

/**
 * Client Supabase para Server Components / Server Actions, autenticado via
 * cookies de sessão. Usa a anon key: a autorização real vem de RLS + do
 * usuário autenticado, não de privilégios elevados.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado a partir de um Server Component (sem acesso de escrita a
          // cookies). Seguro ignorar: o middleware já cuida do refresh de sessão.
        }
      },
    },
  });
}
