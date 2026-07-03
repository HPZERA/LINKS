import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

export const APP_TIMEZONE = "America/Sao_Paulo";

export function formatDateTime(iso: string): string {
  return format(toZonedTime(new Date(iso), APP_TIMEZONE), "dd/MM/yyyy HH:mm", {
    locale: ptBR,
  });
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}
