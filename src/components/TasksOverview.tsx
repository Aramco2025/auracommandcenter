
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSupabaseData } from "@/hooks/useSupabaseData";

export const TasksOverview = () => {
  const { tasks } = useSupabaseData();

  const statusCounts = {
    "To Do": tasks.filter(t => t.status === "To Do").length,
    "In Progress": tasks.filter(t => t.status === "In Progress").length,
    "Done": tasks.filter(t => t.status === "Done").length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "default";
      case "In Progress": return "secondary";
      case "To Do": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Tasks (Notion)</h3>
        <div className="flex gap-1">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Badge key={status} variant="outline" className="text-xs">
              {count}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.slice(0, 4).map((task, index) => (
          <div key={index} className="p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{task.title}</span>
                {task.priority === "High" && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <Badge variant={getStatusColor(task.status)} className="text-xs">
                {task.status}
              </Badge>
            </div>
            {task.status === "In Progress" && task.progress !== null && (
              <Progress value={task.progress} className="h-1 mt-2" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
