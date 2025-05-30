
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';

export const IntegrationSetup = () => {
  const [notionToken, setNotionToken] = useState('');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotionSetup = async () => {
    if (!notionToken || !notionDatabaseId) {
      toast.error('Please provide both Notion token and database ID');
      return;
    }

    setLoading(true);
    try {
      // Test the Notion connection
      const { data, error } = await supabase.functions.invoke('notion-sync', {
        body: { 
          action: 'test_connection',
          notion_token: notionToken,
          database_id: notionDatabaseId
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Notion integration configured successfully!');
      
      // Trigger initial sync
      await supabase.functions.invoke('notion-sync', {
        body: { 
          action: 'sync_tasks',
          notion_token: notionToken,
          database_id: notionDatabaseId
        }
      });
      
      toast.success('Initial Notion sync completed!');
    } catch (error) {
      console.error('Notion setup error:', error);
      toast.error('Failed to set up Notion integration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Integration Setup</h3>
          <p className="text-sm text-muted-foreground">
            Connect your Google and Notion accounts to sync your real data
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div>
                <h4 className="font-medium">Google Workspace</h4>
                <p className="text-sm text-muted-foreground">Gmail & Calendar access</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              <Check className="w-3 h-3 mr-1" />
              Connected via OAuth
            </Badge>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <div>
                  <h4 className="font-medium">Notion</h4>
                  <p className="text-sm text-muted-foreground">Task management integration</p>
                </div>
              </div>
              <Badge variant="outline" className="text-orange-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Setup Required
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Notion Integration Token</label>
                <Input
                  type="password"
                  placeholder="secret_xxxxx..."
                  value={notionToken}
                  onChange={(e) => setNotionToken(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get this from your{' '}
                  <a 
                    href="https://www.notion.so/my-integrations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1"
                  >
                    Notion integrations page
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Database ID</label>
                <Input
                  placeholder="Database ID from Notion URL"
                  value={notionDatabaseId}
                  onChange={(e) => setNotionDatabaseId(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Copy the database ID from your Notion database URL
                </p>
              </div>

              <Button 
                onClick={handleNotionSetup} 
                disabled={loading || !notionToken || !notionDatabaseId}
                className="w-full"
              >
                {loading ? 'Testing Connection...' : 'Connect Notion'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
