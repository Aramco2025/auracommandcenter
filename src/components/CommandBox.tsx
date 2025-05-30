
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic, Send } from "lucide-react";

export const CommandBox = () => {
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recentCommands] = useState([
    "Send follow-up to John Smith",
    "Schedule team meeting for tomorrow",
    "Update project status in Notion"
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      console.log("Executing command:", command);
      setCommand("");
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
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
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleVoice}
          className={`${isListening ? 'bg-red-500 text-white' : ''} transition-colors`}
        >
          <Mic className="w-4 h-4" />
        </Button>
        <Button type="submit" size="icon">
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
