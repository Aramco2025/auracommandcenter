
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, AlertCircle, RefreshCw, Trophy, Target, Zap, Calendar, Mail, CheckCircle2, TrendingUp, Star } from "lucide-react";
import { useRealCommandProcessor } from "@/hooks/useRealSupabaseData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'command' | 'response' | 'error' | 'achievement';
  actionType?: string;
}

interface ProductivityScore {
  tasksCompleted: number;
  emailsSent: number;
  meetingsScheduled: number;
  totalActions: number;
  streak: number;
  level: number;
}

export const ConversationalChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🚀 **Welcome to your AI Command Center!**\n\nI'm Optio, your productivity powerhouse. I don't just chat – I **execute**. Here's what makes me different:\n\n✨ **Instant Actions**: Tell me what you need, watch it happen\n📊 **Smart Tracking**: Every action builds your productivity score\n🎯 **Goal Crushing**: Turn conversations into completed tasks\n\n**Quick Commands:**\n• `Schedule team sync tomorrow 2pm`\n• `Email john@company.com about Q4 review`\n• `Create task: Finish presentation slides`\n• `What's my productivity score?`\n\nReady to level up? What's your first move? 💪",
      sender: 'ai',
      timestamp: new Date(),
      type: 'response'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [productivityScore, setProductivityScore] = useState<ProductivityScore>({
    tasksCompleted: 0,
    emailsSent: 0,
    meetingsScheduled: 0,
    totalActions: 0,
    streak: 0,
    level: 1
  });
  const { processCommand, isProcessing } = useRealCommandProcessor();
  const { user, hasGoogleToken, refreshGoogleToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateProductivityScore = (actionType: string) => {
    setProductivityScore(prev => {
      const newScore = { ...prev };
      newScore.totalActions += 1;
      newScore.streak += 1;

      switch (actionType) {
        case 'email_sent':
          newScore.emailsSent += 1;
          break;
        case 'meeting_scheduled_google':
        case 'meeting_scheduled_local':
          newScore.meetingsScheduled += 1;
          break;
        case 'task_created_notion':
        case 'task_created_local':
          newScore.tasksCompleted += 1;
          break;
      }

      // Level up system
      const newLevel = Math.floor(newScore.totalActions / 5) + 1;
      if (newLevel > newScore.level) {
        newScore.level = newLevel;
        // Add achievement message
        setTimeout(() => {
          const achievementMessage: Message = {
            id: Date.now().toString() + '_achievement',
            content: `🎉 **LEVEL UP!** You've reached Level ${newLevel}! Your productivity game is strong! 💪`,
            sender: 'ai',
            timestamp: new Date(),
            type: 'achievement'
          };
          setMessages(prev => [...prev, achievementMessage]);
        }, 1000);
      }

      return newScore;
    });
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 20) return "🔥";
    if (score >= 15) return "⚡";
    if (score >= 10) return "🚀";
    if (score >= 5) return "💪";
    return "🌱";
  };

  const getIntelligentResponse = (result: any, originalCommand: string) => {
    const actionType = result.action || 'general';
    
    // Update score for successful actions
    if (actionType !== 'general_processing' && actionType !== 'auth_required') {
      updateProductivityScore(actionType);
    }
    
    switch (actionType) {
      case 'email_sent':
        return `📧 **Email Delivered!** ✅\n\nYour message is flying through cyberspace to the recipient. Nice work on staying connected!\n\n*+1 Email Action • Productivity Streak: ${productivityScore.streak + 1}*`;
        
      case 'meeting_scheduled_google':
        return `📅 **Meeting Locked In!** 🎯\n\nYour calendar event is live and invitations are sent. Time to make things happen!\n\n*+1 Calendar Action • You're crushing it!*`;
        
      case 'task_created_notion':
        return `✅ **Task Created!** 📝\n\nAdded "${originalCommand.match(/create task[:\s]+(.+)/i)?.[1] || 'that task'}" to your workspace. Time to execute!\n\n*+1 Task Action • Building momentum!*`;
        
      case 'calendar_query':
      case 'calendar_query_empty':
        if (result.events && result.events.length > 0) {
          return `📅 **Your Schedule Snapshot** 🎯\n\n${result.events.map((event: any) => 
            `🕐 **${event.title}** at ${new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          ).join('\n')}\n\nReady to own your day? Need me to adjust anything?`;
        } else {
          return `📅 **Clear Runway Ahead!** ✨\n\nNo scheduled events today. Perfect opportunity to tackle those big projects or schedule that important meeting!\n\n*Pro tip: Use this time wisely!*`;
        }
        
      case 'auth_required':
        return `🔐 **Quick Setup Needed** ⚡\n\nI need Google access to unleash my full power. Sign out and back in with Google permissions to activate all features!\n\n*Almost there – let's get you connected!*`;
        
      case 'general_processing':
        const responses = [
          `🤔 **Getting Specific** 💭\n\nI'm ready to execute "${originalCommand}" but need more details to deliver exactly what you need. What's the end goal?`,
          `🎯 **Clarification Mode** ✨\n\nI understand the intent behind "${originalCommand}" – help me nail the specifics so I can make it happen perfectly!`,
          `💡 **Detail Check** 🔍\n\nGreat request! Just need a bit more context about "${originalCommand}" to ensure I execute this flawlessly.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
        
      default:
        return `✅ **Action Completed!** 🚀\n\n${result.message || 'Task executed successfully!'}\n\n*Keep the momentum going – what's next?*`;
    }
  };

  const handleRefreshToken = async () => {
    const success = await refreshGoogleToken();
    if (success) {
      toast.success("🔥 Google connection restored!");
    } else {
      toast.error("Connection failed. Please sign out and back in.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing && user) {
      
      // Check for productivity score query
      if (message.toLowerCase().includes('productivity score') || message.toLowerCase().includes('my score')) {
        const scoreMessage: Message = {
          id: Date.now().toString(),
          content: `📊 **Your Productivity Scorecard** ${getScoreEmoji(productivityScore.totalActions)}\n\n🎯 **Level ${productivityScore.level}** • **${productivityScore.totalActions} Total Actions**\n\n📧 Emails Sent: **${productivityScore.emailsSent}**\n📅 Meetings Scheduled: **${productivityScore.meetingsScheduled}**\n✅ Tasks Created: **${productivityScore.tasksCompleted}**\n🔥 Current Streak: **${productivityScore.streak}**\n\n*${productivityScore.totalActions < 5 ? "Just getting started! Keep going!" : productivityScore.totalActions < 15 ? "Great momentum! You're building habits!" : "Productivity master! You're on fire! 🔥"}*`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'response'
        };
        setMessages(prev => [...prev, scoreMessage]);
        setMessage("");
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'command'
      };

      const originalCommand = message;
      setMessages(prev => [...prev, userMessage]);
      setMessage("");
      setIsTyping(true);

      try {
        const result = await processCommand(originalCommand);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getIntelligentResponse(result, originalCommand),
          sender: 'ai',
          timestamp: new Date(),
          type: 'response',
          actionType: result.action
        };

        setMessages(prev => [...prev, aiResponse]);
        
        // Enhanced toast notifications
        if (result.action) {
          if (result.action.includes('sent')) {
            toast.success("📧 Email sent! +1 to your score");
          } else if (result.action.includes('scheduled')) {
            toast.success("📅 Meeting scheduled! Productivity +1");
          } else if (result.action.includes('created')) {
            toast.success("✅ Task created! You're on fire!");
          }
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `⚠️ **Oops!** Something went sideways with "${originalCommand}"\n\nLet's try a different approach – I'm here to make this work! 💪`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'error'
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error("⚠️ Let's try that again!");
      } finally {
        setIsTyping(false);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-0 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 h-[700px] flex flex-col overflow-hidden">
      {/* Header with Scorecard */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Command Center</h3>
              <p className="text-blue-100 text-sm">Execution Mode: Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={hasGoogleToken ? "secondary" : "destructive"} className="text-xs">
              {hasGoogleToken ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
            {!hasGoogleToken && (
              <Button variant="outline" size="sm" onClick={handleRefreshToken} className="text-white border-white/30 hover:bg-white/20">
                <RefreshCw className="w-3 h-3 mr-1" />
                Fix
              </Button>
            )}
          </div>
        </div>

        {/* Live Scorecard */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{productivityScore.level}</div>
            <div className="text-xs text-blue-100">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{productivityScore.totalActions}</div>
            <div className="text-xs text-blue-100">Actions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{productivityScore.streak}</div>
            <div className="text-xs text-blue-100">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{getScoreEmoji(productivityScore.totalActions)}</div>
            <div className="text-xs text-blue-100">Status</div>
          </div>
        </div>
      </div>

      {!hasGoogleToken && (
        <div className="mx-6 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">⚡ Power Mode Locked</p>
            <p className="text-xs text-yellow-700">Connect Google to unlock email & calendar superpowers!</p>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white' 
                  : msg.type === 'achievement'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : msg.type === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700 text-white'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-5 h-5" />
                ) : msg.type === 'achievement' ? (
                  <Trophy className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div className={`flex-1 max-w-[85%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white ml-auto shadow-lg' 
                    : msg.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : msg.type === 'achievement'
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 text-yellow-800'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}>
                  <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>{msg.timestamp.toLocaleTimeString()}</span>
                  {msg.actionType && msg.actionType !== 'general_processing' && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Action Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-6 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me what to execute... (e.g., 'Schedule team sync tomorrow 2pm')"
              className="flex-1 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={isProcessing || !message.trim()}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 h-12 px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setMessage("What's on my calendar today?")}
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Check Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setMessage("What's my productivity score?")}
              className="text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              My Score
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setMessage("Create task: ")}
              className="text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              New Task
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
