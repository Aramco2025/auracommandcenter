
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

export const VoiceNoteInbox = () => {
  const { voiceNotes } = useSupabaseData();

  const handleRecordNote = () => {
    // Voice recording would be implemented here
    toast.info("Voice recording feature coming soon!");
  };

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
        {voiceNotes.slice(0, 3).map((note, index) => (
          <div 
            key={note.id} 
            className="p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleString()}
                </span>
                {note.is_urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {note.duration ? `${Math.floor(note.duration / 60)}:${(note.duration % 60).toString().padStart(2, '0')}` : '0:00'}
              </span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">
              {note.transcript || note.title || 'Voice note'}
            </p>
          </div>
        ))}

        {voiceNotes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No voice notes yet</p>
          </div>
        )}
      </div>

      <Button className="w-full mt-4" variant="outline" onClick={handleRecordNote}>
        <Mic className="w-4 h-4 mr-2" />
        Record New Note
      </Button>
    </Card>
  );
};
