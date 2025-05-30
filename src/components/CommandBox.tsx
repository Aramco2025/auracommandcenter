
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic, Send } from "lucide-react";
import { useCommandProcessor } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

export const CommandBox = () => {
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { processCommand, isProcessing } = useCommandProcessor();
  
  const [recentCommands] = useState([
    "Send follow-up to John Smith",
    "Schedule team meeting for tomorrow", 
    "Update project status in Notion"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isProcessing) {
      try {
        const result = await processCommand(command);
        toast.success(result.result.message || "Command processed successfully");
        setCommand("");
      } catch (error) {
        toast.error("Failed to process command");
        console.error("Command error:", error);
      }
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCommand(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          toast.error("Voice recognition failed");
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        toast.error("Voice recognition not supported");
        setIsListening(false);
      }
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Command Centre</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type or speak your command..."
          className="flex-1 bg-background border-border"
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
        <Button type="submit" size="icon" disabled={isProcessing || !command.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Recent commands:</p>
        <div className="flex flex-wrap gap-2">
          {recentCommands.map((cmd, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-accent transition-colors text-xs"
              onClick={() => setCommand(cmd)}
            >
              {cmd}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
