
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSupabaseData } from "@/hooks/useSupabaseData";

export const AIAgentActivity = () => {
  const { aiActivities } = useSupabaseData();

  const weeklyStats = {
    totalTasks: aiActivities.length,
    completed: aiActivities.filter(a => a.status === 'completed').length,
    saved: "12.5 hours" // This could be calculated based on task types
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "idle": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">AI Agent Activity</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {aiActivities.filter(a => a.status === 'active').length} active
          </Badge>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-background rounded-lg border border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{weeklyStats.totalTasks}</p>
          <p className="text-xs text-muted-foreground">Tasks This Week</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-500">{weeklyStats.completed}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{weeklyStats.saved}</p>
          <p className="text-xs text-muted-foreground">Time Saved</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {aiActivities.slice(0, 4).map((activity, index) => (
          <div key={index} className="p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">{activity.agent_name}</span>
              </div>
              <Badge variant={getStatusColor(activity.status)} className="text-xs">
                {activity.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{activity.task_description}</p>
            
            <div className="space-y-2">
              <Progress value={activity.progress} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{activity.last_action}</span>
                <span className="text-muted-foreground">{activity.progress}%</span>
              </div>
            </div>
          </div>
        ))}

        {aiActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No AI agent activity yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};
