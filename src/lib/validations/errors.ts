/** Código do Postgres para violação de constraint unique. */
export const UNIQUE_VIOLATION = "23505";

export function isPostgresError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}
