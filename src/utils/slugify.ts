/**
 * Normaliza um texto livre para o formato de slug aceito pelo banco
 * (constraint `links_slug_format` / `categories_slug_format`):
 * minusculas, a-z0-9, palavras separadas por um unico hifen.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Versão para usar no onChange do campo enquanto o usuário digita: só
 * remove caracteres inválidos e força minúsculas, sem cortar hífen do
 * final nem colapsar hífens repetidos. Cortar o hífen final a cada
 * keystroke (como o `slugify` completo faz) impede o usuário de digitar
 * "estrategia-roleta", porque o "-" some assim que é digitado, antes de
 * vir a próxima letra. A limpeza completa (trim de hífens, colapso)
 * acontece no blur, via `slugify`.
 */
export function sanitizeSlugInput(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}
