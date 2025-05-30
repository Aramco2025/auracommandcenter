
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickStats } from "@/components/QuickStats";
import { WeeklyPulse } from "@/components/WeeklyPulse";
import { ConversationalChat } from "@/components/ConversationalChat";
import { VoiceNoteInbox } from "@/components/VoiceNoteInbox";
import { OutreachMetrics } from "@/components/OutreachMetrics";
import { TasksOverview } from "@/components/TasksOverview";
import { CalendarPreview } from "@/components/CalendarPreview";
import { AIAgentActivity } from "@/components/AIAgentActivity";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/landing");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

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
                Welcome back, {user.user_metadata?.full_name || user.email} • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="animate-pulse-slow">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live
            </Badge>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Conversational Chat */}
        <ConversationalChat />

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
