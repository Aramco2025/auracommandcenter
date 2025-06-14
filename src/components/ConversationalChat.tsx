
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, AlertCircle, RefreshCw } from "lucide-react";
import { useRealCommandProcessor } from "@/hooks/useRealSupabaseData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'command' | 'response' | 'error';
}

export const ConversationalChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 👋 I'm Optio, your AI command center. I'm here to make your life easier by handling your Gmail, Calendar, and Notion tasks.\n\nJust tell me what you need in plain English! Here are some things I can do:\n\n• Schedule meetings: \"Book a team standup for tomorrow at 9am\"\n• Send emails: \"Email Sarah about the project deadline\"\n• Create tasks: \"Add 'Review budget proposal' to my tasks\"\n• Check calendar: \"What's on my schedule today?\"\n\nWhat would you like me to help you with?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'response'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { processCommand, isProcessing } = useRealCommandProcessor();
  const { user, hasGoogleToken, refreshGoogleToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRefreshToken = async () => {
    const success = await refreshGoogleToken();
    if (success) {
      toast.success("Google connection refreshed successfully!");
    } else {
      toast.error("Failed to refresh Google connection. Please sign out and sign back in.");
    }
  };

  const getIntelligentResponse = (result: any, originalCommand: string) => {
    // Context-aware responses based on command type and result
    const commandType = result.action || 'general';
    
    switch (commandType) {
      case 'email_sent':
        const emailResponses = [
          `✉️ Perfect! I've sent that email for you. The recipient should receive it shortly.`,
          `📧 Done! Your email is on its way. Is there anything else you'd like me to help with?`,
          `✅ Email delivered successfully! I've also saved a copy in your sent items.`
        ];
        return emailResponses[Math.floor(Math.random() * emailResponses.length)];
        
      case 'meeting_scheduled_google':
        return `📅 Excellent! I've created that meeting in your Google Calendar. All attendees will receive calendar invitations automatically. The meeting details are all set up and ready to go!`;
        
      case 'task_created_notion':
        return `📝 Task created! I've added "${originalCommand.match(/create task[:\s]+(.+)/i)?.[1] || 'that task'}" to your Notion workspace. You can find it in your tasks database and update it anytime.`;
        
      case 'calendar_query':
      case 'calendar_query_empty':
        if (result.events && result.events.length > 0) {
          return `📅 Here's what I found on your calendar:\n\n${result.events.map((event: any) => 
            `• ${event.title} at ${new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          ).join('\n')}\n\nNeed me to reschedule anything or add new events?`;
        } else {
          return `📅 You're all clear today! No events scheduled. Perfect time to focus on important work or maybe schedule that meeting you've been putting off?`;
        }
        
      case 'auth_required':
        return `🔐 I need access to your Google account to handle that request. Could you sign out and sign back in with Google? Make sure to accept all permissions so I can access your calendar and email.`;
        
      case 'email_draft_auth_required':
        return `📧 I've prepared that email as a draft, but I need Google access to actually send it. Once you reconnect, I can send it right away!`;
        
      case 'meeting_scheduled_local':
        return `📅 I've scheduled that meeting locally, but couldn't sync it to Google Calendar right now. Once your Google connection is restored, I can sync it properly.`;
        
      case 'general_processing':
        // Make general responses much more intelligent
        const generalResponses = [
          `🤔 I understand you want me to help with "${originalCommand}". Could you give me a bit more detail about what specifically you'd like me to do?`,
          `💭 Interesting request! To make sure I handle this perfectly, could you clarify exactly what action you'd like me to take?`,
          `🎯 I'm ready to help with that! Just need a bit more context - what would you like the end result to be?`
        ];
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
        
      default:
        // Fallback with more personality
        return `✅ Got it! I've processed your request. ${result.message || ''} Let me know if you need any follow-up actions!`;
    }
  };

  const getErrorResponse = (error: any, originalCommand: string) => {
    const errorResponses = [
      `🤔 Hmm, I ran into an issue with "${originalCommand}". Could you try rephrasing that request? I want to make sure I understand exactly what you need.`,
      `⚠️ Something went wrong on my end while processing that command. Let me try a different approach - could you break that down into smaller steps?`,
      `💭 I'm having trouble with that specific request. Could you try asking in a different way? I'm here to help and want to get this right!`
    ];
    
    return errorResponses[Math.floor(Math.random() * errorResponses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing && user) {
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
          type: 'response'
        };

        setMessages(prev => [...prev, aiResponse]);
        
        // More specific toast notifications
        if (result.action) {
          if (result.action.includes('sent')) {
            toast.success("📧 Email sent successfully!");
          } else if (result.action.includes('scheduled')) {
            toast.success("📅 Meeting scheduled!");
          } else if (result.action.includes('created')) {
            toast.success("📝 Task created!");
          } else if (result.action.includes('auth_required')) {
            toast.error("🔐 Google authentication required");
          }
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getErrorResponse(error, originalCommand),
          sender: 'ai',
          timestamp: new Date(),
          type: 'error'
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error("❌ Something went wrong - let's try that again");
        console.error("Chat error:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border h-[600px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Chat with Optio</h3>
        <Badge variant={hasGoogleToken ? "secondary" : "destructive"} className="text-xs">
          {hasGoogleToken ? "Google Connected" : "Google Disconnected"}
        </Badge>
        {!hasGoogleToken && (
          <Button variant="outline" size="sm" onClick={handleRefreshToken}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        )}
      </div>

      {!hasGoogleToken && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            I need Google access for calendar and email features. Please sign out and sign back in with Google!
          </p>
        </div>
      )}
      
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : msg.type === 'error'
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me to schedule meetings, send emails, create tasks..."
          className="flex-1 bg-background border-border"
          disabled={isProcessing}
        />
        <Button type="submit" size="icon" disabled={isProcessing || !message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-2">
        <p className="text-xs text-muted-foreground text-center">
          Try: "What's on my calendar today?" • "Send email to john@example.com about meeting" • "Create task: Review project"
        </p>
      </div>
    </Card>
  );
};
