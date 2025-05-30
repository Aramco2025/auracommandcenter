
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, MessageSquare } from "lucide-react";

export const QuickStats = () => {
  const stats = [
    {
      icon: Mail,
      label: "Emails Sent",
      value: "24",
      change: "+12%",
      trend: "up"
    },
    {
      icon: MessageSquare,
      label: "Replies",
      value: "8",
      change: "+5%",
      trend: "up"
    },
    {
      icon: Calendar,
      label: "Meetings Today",
      value: "3",
      change: "0%",
      trend: "neutral"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-card border-border hover:bg-accent/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
            <Badge 
              variant={stat.trend === "up" ? "default" : "secondary"} 
              className="text-xs"
            >
              {stat.change}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};
