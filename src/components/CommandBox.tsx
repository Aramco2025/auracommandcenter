
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mic, Send, Bot, User, AlertCircle, RefreshCw } from "lucide-react";
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

export const CommandBox = () => {
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🚀 **Command Center Active!**\n\nI'm your AI assistant ready to execute commands and help with tasks. Try commands like:\n\n• `Create task: Review quarterly reports`\n• `Schedule meeting tomorrow 2pm`\n• `Email john@company.com about project update`\n• `What's on my calendar today?`\n\nWhat can I help you accomplish?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'response'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { processCommand, isProcessing } = useRealCommandProcessor();
  const { user, hasGoogleToken, refreshGoogleToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [recentCommands] = useState([
    "What's on my calendar today?",
    "Create task: Review quarterly reports",
    "Schedule team meeting tomorrow",
    "Send follow-up email"
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getIntelligentResponse = (result: any, originalCommand: string) => {
    const actionType = result.action || 'general';
    
    switch (actionType) {
      case 'email_sent':
        return `📧 **Email Sent Successfully!** ✅\n\nYour message has been delivered. Great job staying connected!`;
        
      case 'meeting_scheduled_google':
        return `📅 **Meeting Scheduled!** 🎯\n\nYour calendar event is now live and invitations have been sent.`;
        
      case 'task_created_notion':
      case 'task_created_local':
        return `✅ **Task Created!** 📝\n\nTask "${originalCommand.match(/create task[:\s]+(.+)/i)?.[1] || 'New Task'}" has been added to your workspace.`;
        
      case 'calendar_query':
      case 'calendar_query_empty':
        if (result.events && result.events.length > 0) {
          return `📅 **Your Schedule Today** 🎯\n\n${result.events.map((event: any) => 
            `🕐 **${event.title}** at ${new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          ).join('\n')}\n\nNeed me to make any adjustments?`;
        } else {
          return `📅 **Clear Schedule Ahead!** ✨\n\nNo events scheduled today. Perfect time to tackle important projects!`;
        }
        
      case 'auth_required':
        return `🔐 **Google Connection Needed** ⚡\n\nTo execute this command, I need access to your Google services. Please refresh your connection or sign in again.`;
        
      case 'general_processing':
        return `🤔 **Processing Request** 💭\n\nI understand "${originalCommand}" but need more specific details to execute this perfectly. Could you provide more context?`;
        
      default:
        return `✅ **Command Executed!** 🚀\n\n${result.message || 'Your request has been processed successfully!'}\n\nWhat's next on your agenda?`;
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
    if (command.trim() && !isProcessing && user) {
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content: command,
        sender: 'user',
        timestamp: new Date(),
        type: 'command'
      };

      const originalCommand = command;
      setMessages(prev => [...prev, userMessage]);
      setCommand("");
      setIsTyping(true);

      try {
        console.log('Submitting command:', originalCommand);
        const result = await processCommand(originalCommand);
        console.log('Command result:', result);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getIntelligentResponse(result, originalCommand),
          sender: 'ai',
          timestamp: new Date(),
          type: 'response'
        };

        setMessages(prev => [...prev, aiResponse]);
        toast.success(result.message || "Command processed successfully");
        
      } catch (error) {
        console.error("Command error:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `⚠️ **Command Failed** \n\nSomething went wrong with "${originalCommand}". Let's try a different approach!`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'error'
        };
        
        setMessages(prev => [...prev, errorMessage]);
        toast.error("Failed to process command");
      } finally {
        setIsTyping(false);
      }
    } else if (!user) {
      toast.error("Please sign in to use commands");
    } else if (!command.trim()) {
      toast.error("Please enter a command");
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice transcript:', transcript);
          setCommand(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Voice recognition error:', event.error);
          setIsListening(false);
          toast.error("Voice recognition failed");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to start recognition:', error);
          setIsListening(false);
          toast.error("Failed to start voice recognition");
        }
      } else {
        toast.error("Voice recognition not supported in this browser");
        setIsListening(false);
      }
    }
  };

  if (!user) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Command Centre</h3>
          <Badge variant="secondary" className="text-xs">
            Sign in to activate
          </Badge>
        </div>
        <div className="text-center text-muted-foreground">
          <p>Please sign in to use the Command Centre</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 h-[500px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Command Center</h3>
              <p className="text-blue-100 text-sm">Ready to execute your commands</p>
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
      </div>

      {!hasGoogleToken && (
        <div className="mx-4 mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Limited Mode Active</p>
            <p className="text-xs text-yellow-700">Connect Google for full email & calendar features</p>
          </div>
        </div>
      )}
      
      {/* Chat Area */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' 
                  : msg.type === 'error'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700 text-white'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white ml-auto shadow-lg' 
                    : msg.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}>
                  <div className="whitespace-pre-line leading-relaxed font-medium">{msg.content}</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type your command or ask me anything..."
              className="flex-1 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-slate-800 placeholder:text-slate-500"
              disabled={isProcessing}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleVoice}
              className={`${isListening ? 'bg-red-500 text-white' : ''} transition-colors`}
              disabled={isProcessing}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button 
              type="submit" 
              size="icon"
              disabled={isProcessing || !command.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Commands */}
          <div className="flex flex-wrap gap-2">
            {recentCommands.map((cmd, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-accent transition-colors text-xs text-slate-700"
                onClick={() => setCommand(cmd)}
              >
                {cmd}
              </Badge>
            ))}
          </div>
        </form>
      </div>
    </Card>
  );
};
