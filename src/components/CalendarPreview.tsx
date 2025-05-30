
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export const CalendarPreview = () => {
  const events = [
    {
      time: "09:00",
      title: "Team Standup",
      duration: "30m",
      status: "upcoming",
      attendees: 5
    },
    {
      time: "11:00",
      title: "Client Call - Acme Corp",
      duration: "1h",
      status: "upcoming",
      attendees: 3
    },
    {
      time: "14:30",
      title: "Product Review",
      duration: "45m",
      status: "upcoming",
      attendees: 8
    },
    {
      time: "16:00",
      title: "1:1 with Sarah",
      duration: "30m",
      status: "upcoming",
      attendees: 2
    }
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
        </div>
        <Badge variant="outline" className="text-xs">{events.length} events</Badge>
      </div>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-all duration-200">
            <div className="text-sm font-medium text-primary min-w-[50px]">
              {event.time}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{event.duration}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </Card>
  );
};
