
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export const OutreachMetrics = () => {
  const metrics = {
    emailsSent: 24,
    emailsTarget: 30,
    replies: 8,
    replyRate: 33.3,
    newLeads: 5,
    hotLeads: 2
  };

  const recentActivity = [
    { action: "Email sent", contact: "John Smith", time: "5 min ago", status: "delivered" },
    { action: "Reply received", contact: "Sarah Johnson", time: "12 min ago", status: "positive" },
    { action: "Follow-up scheduled", contact: "Mike Chen", time: "1 hour ago", status: "pending" }
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Outreach Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Daily Target</span>
            <span className="text-muted-foreground">{metrics.emailsSent}/{metrics.emailsTarget}</span>
          </div>
          <Progress value={(metrics.emailsSent / metrics.emailsTarget) * 100} className="h-2" />
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{metrics.replyRate}%</p>
          <p className="text-sm text-muted-foreground">Reply Rate</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{metrics.newLeads}</p>
          <p className="text-sm text-muted-foreground">New Leads</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{activity.time}</span>
              <Badge variant="outline" className="text-xs">{activity.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
