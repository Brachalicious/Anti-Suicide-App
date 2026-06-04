export interface ChatConversation {
  id: number;
  title: string;
  createdAt: Date;
}

export interface ChatMessageRow {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: Date;
}

export interface IChatStorage {
  getConversation(id: number): Promise<ChatConversation | undefined>;
  getAllConversations(): Promise<ChatConversation[]>;
  createConversation(title: string): Promise<ChatConversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<ChatMessageRow[]>;
  createMessage(
    conversationId: number,
    role: string,
    content: string
  ): Promise<ChatMessageRow>;
}

let nextConversationId = 1;
let nextMessageId = 1;

const conversations: ChatConversation[] = [];
const messages: ChatMessageRow[] = [];

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    return conversations.find((c) => c.id === id);
  },

  async getAllConversations() {
    return [...conversations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async createConversation(title: string) {
    const conversation: ChatConversation = {
      id: nextConversationId++,
      title,
      createdAt: new Date(),
    };
    conversations.push(conversation);
    return conversation;
  },

  async deleteConversation(id: number) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].conversationId === id) messages.splice(i, 1);
    }
    for (let i = conversations.length - 1; i >= 0; i--) {
      if (conversations[i].id === id) conversations.splice(i, 1);
    }
  },

  async getMessagesByConversation(conversationId: number) {
    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const message: ChatMessageRow = {
      id: nextMessageId++,
      conversationId,
      role,
      content,
      createdAt: new Date(),
    };
    messages.push(message);
    return message;
  },
};
