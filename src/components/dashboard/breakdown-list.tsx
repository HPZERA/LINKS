import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/utils/format";
import type { BreakdownItem } from "@/services/analytics.service";

export function BreakdownList({ title, items }: { title: string; items: BreakdownItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados para o período selecionado.</p>
        ) : (
          items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{item.label}</span>
                <span className="text-muted-foreground">{formatNumber(item.count)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
