
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, MessageSquare } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";

export const QuickStats = () => {
  const { emails, events } = useSupabaseData();

  // Calculate stats from real data
  const emailsSentToday = emails.filter(email => 
    email.is_sent && 
    new Date(email.created_at).toDateString() === new Date().toDateString()
  ).length;

  const repliesReceived = emails.filter(email => 
    email.is_reply && 
    new Date(email.created_at).toDateString() === new Date().toDateString()
  ).length;

  const meetingsToday = events.filter(event =>
    new Date(event.start_time).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      icon: Mail,
      label: "Emails Sent",
      value: emailsSentToday.toString(),
      change: emailsSentToday > 0 ? "+12%" : "0%",
      trend: emailsSentToday > 0 ? "up" : "neutral"
    },
    {
      icon: MessageSquare,
      label: "Replies",
      value: repliesReceived.toString(),
      change: repliesReceived > 0 ? "+5%" : "0%",
      trend: repliesReceived > 0 ? "up" : "neutral"
    },
    {
      icon: Calendar,
      label: "Meetings Today",
      value: meetingsToday.toString(),
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
