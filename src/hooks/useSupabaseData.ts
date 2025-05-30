import { useAuth } from './useAuth';
import { useRealSupabaseData, useRealCommandProcessor } from './useRealSupabaseData';

// Sample data to simulate what would come from Supabase
const sampleTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    due_date: '2025-06-02',
    created_at: '2025-05-28',
    notion_page_id: 'page-1',
    notion_url: 'https://notion.so/page-1',
    user_id: 'sample-user',
    updated_at: '2025-05-30',
    assignee: 'John Doe',
    last_edited_time: '2025-05-30T10:00:00Z',
    tags: ['urgent', 'client']
  },
  {
    id: '2',
    title: 'Review marketing materials',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    due_date: '2025-06-05',
    created_at: '2025-05-29',
    notion_page_id: 'page-2',
    notion_url: 'https://notion.so/page-2',
    user_id: 'sample-user',
    updated_at: '2025-05-30',
    assignee: 'Jane Smith',
    last_edited_time: '2025-05-30T11:00:00Z',
    tags: ['marketing']
  },
  {
    id: '3',
    title: 'Team standup meeting prep',
    status: 'Done',
    priority: 'Low',
    progress: 100,
    due_date: '2025-05-30',
    created_at: '2025-05-27',
    notion_page_id: 'page-3',
    notion_url: 'https://notion.so/page-3',
    user_id: 'sample-user',
    updated_at: '2025-05-30',
    assignee: 'Mike Johnson',
    last_edited_time: '2025-05-30T09:00:00Z',
    tags: ['meeting']
  },
  {
    id: '4',
    title: 'Update client documentation',
    status: 'To Do',
    priority: 'High',
    progress: 0,
    due_date: '2025-06-01',
    created_at: '2025-05-30',
    notion_page_id: 'page-4',
    notion_url: 'https://notion.so/page-4',
    user_id: 'sample-user',
    updated_at: '2025-05-30',
    assignee: 'Sarah Wilson',
    last_edited_time: '2025-05-30T12:00:00Z',
    tags: ['documentation', 'client']
  },
  {
    id: '5',
    title: 'Code review for new feature',
    status: 'In Progress',
    priority: 'Medium',
    progress: 30,
    due_date: '2025-06-03',
    created_at: '2025-05-29',
    notion_page_id: 'page-5',
    notion_url: 'https://notion.so/page-5',
    user_id: 'sample-user',
    updated_at: '2025-05-30',
    assignee: 'Alex Chen',
    last_edited_time: '2025-05-30T13:00:00Z',
    tags: ['development', 'review']
  }
];

const sampleEmails = [
  {
    id: '1',
    subject: 'Project Update Required',
    sender_email: 'client@example.com',
    received_at: '2025-05-30T10:30:00Z',
    body_preview: 'Hi, we need an update on the current project status...',
    is_sent: false,
    is_reply: false,
    sent_at: null,
    created_at: '2025-05-30T10:30:00Z',
    updated_at: '2025-05-30T10:30:00Z',
    message_id: 'msg-1',
    thread_id: 'thread-1',
    recipient_emails: ['you@company.com'],
    labels: ['inbox', 'important'],
    user_id: 'sample-user'
  },
  {
    id: '2',
    subject: 'Meeting Confirmation',
    sender_email: 'team@company.com',
    received_at: '2025-05-30T09:15:00Z',
    body_preview: 'Confirming our meeting for tomorrow at 2 PM...',
    is_sent: false,
    is_reply: true,
    sent_at: null,
    created_at: '2025-05-30T09:15:00Z',
    updated_at: '2025-05-30T09:15:00Z',
    message_id: 'msg-2',
    thread_id: 'thread-2',
    recipient_emails: ['you@company.com'],
    labels: ['inbox'],
    user_id: 'sample-user'
  },
  {
    id: '3',
    subject: 'Welcome to our service',
    sender_email: 'you@company.com',
    received_at: null,
    body_preview: 'Thank you for signing up! Here is how to get started...',
    is_sent: true,
    is_reply: false,
    sent_at: '2025-05-30T08:00:00Z',
    created_at: '2025-05-30T08:00:00Z',
    updated_at: '2025-05-30T08:00:00Z',
    message_id: 'msg-3',
    thread_id: 'thread-3',
    recipient_emails: ['newuser@example.com'],
    labels: ['sent'],
    user_id: 'sample-user'
  }
];

const sampleEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    start_time: '2025-05-31T14:00:00Z',
    end_time: '2025-05-31T15:00:00Z',
    description: 'Weekly team sync meeting',
    location: 'Conference Room A',
    meeting_link: 'https://meet.google.com/abc-def-ghi',
    status: 'confirmed',
    attendees: [
      { email: 'john@company.com', name: 'John Doe' },
      { email: 'jane@company.com', name: 'Jane Smith' }
    ],
    google_event_id: 'event-1',
    created_at: '2025-05-30T10:00:00Z',
    updated_at: '2025-05-30T10:00:00Z',
    user_id: 'sample-user'
  },
  {
    id: '2',
    title: 'Client Presentation',
    start_time: '2025-06-02T10:00:00Z',
    end_time: '2025-06-02T11:30:00Z',
    description: 'Quarterly review presentation',
    location: 'Client Office',
    meeting_link: null,
    status: 'confirmed',
    attendees: [
      { email: 'client@example.com', name: 'Client Rep' }
    ],
    google_event_id: 'event-2',
    created_at: '2025-05-29T15:00:00Z',
    updated_at: '2025-05-29T15:00:00Z',
    user_id: 'sample-user'
  }
];

const sampleAIActivities = [
  {
    id: '1',
    agent_name: 'Email Assistant',
    task_description: 'Processing incoming emails and drafting responses',
    status: 'active',
    progress: 80,
    started_at: '2025-05-30T09:00:00Z',
    completed_at: null,
    last_action: 'Drafted 3 email responses',
    created_at: '2025-05-30T09:00:00Z',
    updated_at: '2025-05-30T12:00:00Z',
    user_id: 'sample-user'
  },
  {
    id: '2',
    agent_name: 'Calendar Optimizer',
    task_description: 'Optimizing schedule for maximum productivity',
    status: 'completed',
    progress: 100,
    started_at: '2025-05-30T08:00:00Z',
    completed_at: '2025-05-30T08:30:00Z',
    last_action: 'Rescheduled 2 meetings for better time slots',
    created_at: '2025-05-30T08:00:00Z',
    updated_at: '2025-05-30T08:30:00Z',
    user_id: 'sample-user'
  },
  {
    id: '3',
    agent_name: 'Task Prioritizer',
    task_description: 'Analyzing and prioritizing pending tasks',
    status: 'active',
    progress: 45,
    started_at: '2025-05-30T11:00:00Z',
    completed_at: null,
    last_action: 'Reviewed 8 tasks and updated priorities',
    created_at: '2025-05-30T11:00:00Z',
    updated_at: '2025-05-30T12:15:00Z',
    user_id: 'sample-user'
  }
];

const sampleVoiceNotes = [
  {
    id: '1',
    title: 'Meeting notes from client call',
    transcript: 'Client wants to accelerate the timeline for the project. Need to discuss with team about resource allocation.',
    duration: 120,
    is_processed: true,
    is_urgent: true,
    audio_url: null,
    tags: ['client', 'urgent', 'meeting'],
    created_at: '2025-05-30T10:30:00Z',
    updated_at: '2025-05-30T10:35:00Z',
    user_id: 'sample-user'
  },
  {
    id: '2',
    title: 'Ideas for marketing campaign',
    transcript: 'Brainstorming session results: focus on social media presence, influencer partnerships, and content marketing.',
    duration: 180,
    is_processed: true,
    is_urgent: false,
    audio_url: null,
    tags: ['marketing', 'brainstorming'],
    created_at: '2025-05-30T09:15:00Z',
    updated_at: '2025-05-30T09:20:00Z',
    user_id: 'sample-user'
  },
  {
    id: '3',
    title: 'Quick reminder',
    transcript: 'Remember to follow up with the design team about the new mockups.',
    duration: 30,
    is_processed: true,
    is_urgent: false,
    audio_url: null,
    tags: ['reminder', 'design'],
    created_at: '2025-05-30T08:45:00Z',
    updated_at: '2025-05-30T08:46:00Z',
    user_id: 'sample-user'
  }
];

export const useSupabaseData = () => {
  const { user } = useAuth();
  const realData = useRealSupabaseData();

  // If user is authenticated, use real data, otherwise use sample data
  if (user) {
    return realData;
  }

  // Return sample data for unauthenticated users
  return {
    emails: [],
    tasks: sampleTasks.slice(0, 3), // Show fewer sample tasks when not authenticated
    events: [],
    aiActivities: [],
    voiceNotes: [],
  };
};

export const useCommandProcessor = () => {
  const { user } = useAuth();
  const realProcessor = useRealCommandProcessor();
  
  if (user) {
    return realProcessor;
  }

  // Fallback for unauthenticated users
  return {
    processCommand: async (command: string) => {
      throw new Error('Please sign in to use commands');
    },
    isProcessing: false,
  };
};
