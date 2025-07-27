import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { RiskCategoryChart } from "@/components/dashboard/RiskCategoryChart";
import { RiskHeatmap } from "@/components/dashboard/RiskHeatmap";
import { OverdueAlerts } from "@/components/dashboard/OverdueAlerts";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RiskHeatmap />
        </div>
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
          <RiskCategoryChart />
          <OverdueAlerts />
      </div>
    </div>
  );
}