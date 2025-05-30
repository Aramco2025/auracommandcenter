
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const AIAgentActivity = () => {
  const activities = [
    {
      agent: "Email Assistant",
      task: "Processing outreach sequences",
      progress: 85,
      status: "active",
      lastAction: "Sent 3 follow-ups"
    },
    {
      agent: "Calendar Optimizer",
      task: "Analyzing meeting patterns",
      progress: 60,
      status: "active",
      lastAction: "Rescheduled 2 conflicts"
    },
    {
      agent: "Task Prioritizer",
      task: "Updating Notion database",
      progress: 95,
      status: "completing",
      lastAction: "Updated 8 task statuses"
    },
    {
      agent: "Lead Scorer",
      task: "Analyzing new prospects",
      progress: 40,
      status: "active",
      lastAction: "Scored 12 new leads"
    }
  ];

  const weeklyStats = {
    totalTasks: 156,
    completed: 142,
    saved: "12.5 hours"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completing": return "secondary";
      case "idle": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">AI Agent Activity</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">4 active</Badge>
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
        {activities.map((activity, index) => (
          <div key={index} className="p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">{activity.agent}</span>
              </div>
              <Badge variant={getStatusColor(activity.status)} className="text-xs">
                {activity.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{activity.task}</p>
            
            <div className="space-y-2">
              <Progress value={activity.progress} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{activity.lastAction}</span>
                <span className="text-muted-foreground">{activity.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
