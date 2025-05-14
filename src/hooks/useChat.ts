import { useState, useCallback } from 'react';
import { ChatMessage, ChatSession } from '../types/chat';
import { BetSlip } from '../types/bet';

export const useChat = (betSlip: BetSlip) => {
  const [session, setSession] = useState<ChatSession>(() => ({
    id: crypto.randomUUID(),
    messages: [
      {
        id: crypto.randomUUID(),
        type: 'system',
        content: `I've analyzed your bet slip. The OCR confidence is ${(betSlip.ocrResults.confidence * 100).toFixed(1)}%. Would you like me to explain what I found?`,
        timestamp: Date.now(),
        confidence: betSlip.ocrResults.confidence
      }
    ],
    betSlip,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }));
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: Date.now()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setIsTyping(true);

    // Simulate system response
    await new Promise(res => setTimeout(res, 1000));
    const systemMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'system',
      content: `I understand you're asking about "${content}". Let me analyze that for you.`,
      timestamp: Date.now(),
      confidence: 0.85
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, systemMessage]
    }));

    setIsTyping(false);
  }, []);

  return {
    session,
    sendMessage,
    isTyping
  };
}; 