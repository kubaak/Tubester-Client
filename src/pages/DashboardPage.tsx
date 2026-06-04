import { PendingImprovementsVideosBlock } from '../features/videos/components/PendingImprovementsVideosBlock';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="glass p-8 rounded-3xl shadow-moderate border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
          </div>
        </div>
      </div>

      <PendingImprovementsVideosBlock />
    </div>
  );
}
