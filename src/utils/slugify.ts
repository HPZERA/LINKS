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
