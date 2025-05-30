
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, MessageSquare } from "lucide-react";
import { QuickStats } from "@/components/QuickStats";
import { WeeklyPulse } from "@/components/WeeklyPulse";
import { CommandBox } from "@/components/CommandBox";
import { VoiceNoteInbox } from "@/components/VoiceNoteInbox";
import { OutreachMetrics } from "@/components/OutreachMetrics";
import { TasksOverview } from "@/components/TasksOverview";
import { CalendarPreview } from "@/components/CalendarPreview";
import { AIAgentActivity } from "@/components/AIAgentActivity";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background dark p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-glow">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">AURA Command Centre</h1>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="animate-pulse-slow">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live
            </Badge>
            <UserMenu />
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Command Box */}
        <CommandBox />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <OutreachMetrics />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TasksOverview />
              <CalendarPreview />
            </div>
            <AIAgentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeeklyPulse />
            <VoiceNoteInbox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
