
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";

export const CalendarPreview = () => {
  const { events } = useSupabaseData();

  // Filter events for today
  const todayEvents = events.filter(event =>
    new Date(event.start_time).toDateString() === new Date().toDateString()
  ).slice(0, 4);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
        </div>
        <Badge variant="outline" className="text-xs">{todayEvents.length} events</Badge>
      </div>
      
      <div className="space-y-3">
        {todayEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-all duration-200">
            <div className="text-sm font-medium text-primary min-w-[50px]">
              {new Date(event.start_time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {Math.round((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60))}m
                </span>
                {event.attendees && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {Array.isArray(event.attendees) ? event.attendees.length : 1} attendees
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
        
        {todayEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events scheduled for today</p>
          </div>
        )}
      </div>
    </Card>
  );
};
