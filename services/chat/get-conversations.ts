export interface ChatParticipant {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isSeen: boolean;
}

export interface Conversation {
  id: string;
  participant: ChatParticipant;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isTyping?: boolean;
}

const globalForChat = globalThis as unknown as {
  nexusConversations: Conversation[] | undefined;
  nexusMessages: Record<string, ChatMessage[]> | undefined;
};

export const initialConversations: Conversation[] = [
  {
    id: "conv_1",
    participant: {
      id: "user_kavya",
      fullName: "Kavya Sharma",
      username: "kavya_swe",
      avatarUrl: null,
      role: "ALUMNI",
      isOnline: true,
    },
    lastMessage: "I'd be glad to review your system design mock. When are you free this weekend?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: 1,
    isTyping: true,
  },
  {
    id: "conv_2",
    participant: {
      id: "user_officer",
      fullName: "Dr. Evelyn Reed",
      username: "placement_cell",
      avatarUrl: null,
      role: "PLACEMENT_OFFICER",
      isOnline: false,
    },
    lastMessage: "Please verify that your 7th semester transcript is updated in the placement portal.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unreadCount: 0,
    isTyping: false,
  },
];

export const initialMessages: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: "msg_1",
      conversationId: "conv_1",
      senderId: "current_user",
      text: "Hi Kavya! Saw your post regarding Google SWE interview prep. Are you still open for 1:1 mocks?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isSeen: true,
    },
    {
      id: "msg_2",
      conversationId: "conv_1",
      senderId: "user_kavya",
      text: "I'd be glad to review your system design mock. When are you free this weekend?",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isSeen: false,
    },
  ],
  conv_2: [
    {
      id: "msg_3",
      conversationId: "conv_2",
      senderId: "user_officer",
      text: "Please verify that your 7th semester transcript is updated in the placement portal.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      isSeen: true,
    },
  ],
};

export const conversationsStore = globalForChat.nexusConversations ?? initialConversations;
export const messagesStore = globalForChat.nexusMessages ?? initialMessages;

if (!globalForChat.nexusConversations) globalForChat.nexusConversations = conversationsStore;
if (!globalForChat.nexusMessages) globalForChat.nexusMessages = messagesStore;

export async function getConversations(): Promise<Conversation[]> {
  return conversationsStore;
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  return messagesStore[conversationId] ?? [];
}
