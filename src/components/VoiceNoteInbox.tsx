
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar } from "lucide-react";

export const VoiceNoteInbox = () => {
  const voiceNotes = [
    {
      id: 1,
      timestamp: "2 min ago",
      duration: "0:45",
      preview: "Follow up with Sarah about the proposal...",
      urgent: true
    },
    {
      id: 2,
      timestamp: "1 hour ago",
      duration: "1:20",
      preview: "Schedule team retrospective for next week...",
      urgent: false
    },
    {
      id: 3,
      timestamp: "3 hours ago",
      duration: "0:30",
      preview: "Update project timeline in Notion...",
      urgent: false
    }
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Voice Notes</h3>
        </div>
        <Badge variant="secondary" className="text-xs">{voiceNotes.length}</Badge>
      </div>
      
      <div className="space-y-3">
        {voiceNotes.map((note) => (
          <div 
            key={note.id} 
            className="p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                {note.urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{note.duration}</span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{note.preview}</p>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4" variant="outline">
        <Mic className="w-4 h-4 mr-2" />
        Record New Note
      </Button>
    </Card>
  );
};
