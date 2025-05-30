
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const WeeklyPulse = () => {
  const pulseData = {
    productivity: 85,
    outreach: 72,
    focus: 90,
    energy: 68
  };

  const weeklyGoals = [
    { name: "Email outreach", completed: 24, target: 30 },
    { name: "Notion updates", completed: 8, target: 10 },
    { name: "Calendar optimization", completed: 5, target: 5 }
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Weekly Pulse</h3>
        <Badge variant="outline" className="text-xs">Week 48</Badge>
      </div>
      
      <div className="space-y-4 mb-6">
        {Object.entries(pulseData).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize text-foreground">{key}</span>
              <span className="text-muted-foreground">{value}%</span>
            </div>
            <Progress value={value} className="h-2" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Weekly Goals</h4>
        {weeklyGoals.map((goal, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{goal.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {goal.completed}/{goal.target}
              </span>
              <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(goal.completed / goal.target) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
