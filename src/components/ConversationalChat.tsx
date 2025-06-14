
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

  const getPersonalizedResponse = (result: any) => {
    const responses = {
      email_sent: [
        "✉️ Perfect! Your email has been sent successfully.",
        "📧 Done! I've sent that email for you.",
        "✅ Email delivered! Anything else I can help with?"
      ],
      meeting_scheduled_google: [
        "📅 Great! I've added that meeting to your Google Calendar.",
        "✅ Meeting scheduled! It's now in your calendar.",
        "🎯 Perfect! Your meeting is all set up in Google Calendar."
      ],
      task_created_notion: [
        "📝 Task created! I've added that to your Notion workspace.",
        "✅ Done! Your new task is now in Notion.",
        "🎯 Perfect! I've created that task for you in Notion."
      ],
      calendar_query: [
        "📅 Here's what I found on your calendar:",
        "🗓️ Let me check your schedule for you:",
        "📋 Here's what you have coming up:"
      ],
      auth_required: [
        "🔐 I need to connect to your Google account to do that. Could you sign out and sign back in with Google?",
        "🔗 Let's get you connected to Google first so I can access your calendar and email.",
        "⚡ I'll need Google access for that. Please reconnect your account when you get a chance."
      ]
    };

    const actionType = result.action || 'general';
    const responseList = responses[actionType as keyof typeof responses] || [result.message];
    const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];
    
    return randomResponse;
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

      setMessages(prev => [...prev, userMessage]);
      setMessage("");
      setIsTyping(true);

      try {
        const result = await processCommand(message);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getPersonalizedResponse(result),
          sender: 'ai',
          timestamp: new Date(),
          type: 'response'
        };

        setMessages(prev => [...prev, aiResponse]);
        
        if (result.action) {
          if (result.action.includes('_google') || result.action.includes('sent') || result.action.includes('created')) {
            toast.success(`✅ ${result.action.replace('_', ' ').toUpperCase()}`);
          } else if (result.action.includes('auth_required')) {
            toast.error("Google authentication required - please sign out and sign back in");
          } else {
            toast.success(`Action completed: ${result.action}`);
          }
        }
      } catch (error) {
        const errorResponses = [
          "🤔 Hmm, I had trouble with that request. Could you try rephrasing it?",
          "⚠️ Something went wrong on my end. Mind giving that another shot?",
          "💭 I didn't quite catch that. Could you try asking in a different way?"
        ];
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: errorResponses[Math.floor(Math.random() * errorResponses.length)],
          sender: 'ai',
          timestamp: new Date(),
          type: 'error'
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error("Failed to process your message");
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
