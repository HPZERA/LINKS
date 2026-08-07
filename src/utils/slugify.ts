/**
 * Separadores aceitos num slug, além de a-z0-9: hífen, ponto e
 * ponto-e-vírgula. Mantidos num único lugar porque o mesmo conjunto de
 * caracteres precisa ficar em sincronia com os regexes de validação
 * (lib/validations/link.schema.ts, category.schema.ts) e com os
 * CHECK constraints do banco (supabase/migrations/0013_slug_separators.sql).
 */
const SEPARATOR_CHARS = "\\-.;";
const SEPARATOR_CLASS = `[${SEPARATOR_CHARS}]`;

/**
 * Normaliza um texto livre para o formato de slug aceito pelo banco:
 * minúsculas, a-z0-9, separados por -, . ou ;, sem separador duplicado
 * nem nas pontas.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(new RegExp(`[^a-z0-9${SEPARATOR_CHARS}]+`, "g"), "-")
    .replace(new RegExp(`^${SEPARATOR_CLASS}+|${SEPARATOR_CLASS}+$`, "g"), "")
    .replace(new RegExp(`${SEPARATOR_CLASS}{2,}`, "g"), (match) => match[0]);
}

/**
 * Versão para usar no onChange do campo enquanto o usuário digita: só
 * remove caracteres inválidos e força minúsculas, sem cortar separador do
 * final nem colapsar separadores repetidos. Cortar o separador final a
 * cada keystroke (como o `slugify` completo faz) impede o usuário de
 * digitar algo como "estrategia-roleta", porque o "-" some assim que é
 * digitado, antes de vir a próxima letra. A limpeza completa (trim,
 * colapso) acontece no blur, via `slugify`.
 */
export function sanitizeSlugInput(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(new RegExp(`[^a-z0-9${SEPARATOR_CHARS}]`, "g"), "");
}
