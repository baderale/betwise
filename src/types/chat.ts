export interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: number;
  confidence?: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  betSlip?: BetSlip;
  createdAt: number;
  expiresAt: number;
} 