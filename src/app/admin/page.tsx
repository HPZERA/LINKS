import { LinkIcon, MousePointerClick, CalendarDays, CalendarClock } from "lucide-react";
import { getDashboardStats } from "@/services/analytics.service";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopLinksTable } from "@/components/dashboard/top-links-table";
import { RecentClicksTable } from "@/components/dashboard/recent-clicks-table";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos seus links e cliques.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Links" value={stats.totalLinks} icon={LinkIcon} />
        <StatCard label="Total de Cliques" value={stats.totalClicks} icon={MousePointerClick} />
        <StatCard label="Cliques Hoje" value={stats.clicksToday} icon={CalendarDays} />
        <StatCard label="Cliques Ontem" value={stats.clicksYesterday} icon={CalendarClock} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopLinksTable links={stats.topLinks} />
        <RecentClicksTable clicks={stats.recentClicks} />
      </div>
    </div>
  );
}
