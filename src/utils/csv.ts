export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(String(column.value(row) ?? ""))).join(","),
  );
  // BOM UTF-8 no início: evita acentos quebrados ao abrir o CSV no Excel.
  return ["﻿" + header, ...lines].join("\n");
}
