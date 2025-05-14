import { useState, useCallback } from 'react';
import { ChatMessage, ChatSession } from '../types/chat';
import { BetSlip } from '../types/bet';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
}));

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

    // Compose the prompt
    const prompt = `You are an NBA stats assistant. The user uploaded a bet slip with OCR confidence ${(betSlip.ocrResults.confidence * 100).toFixed(1)}%.\nOCR text: ${betSlip.ocrResults.text}\nUser question: ${content}\nProvide a concise, stat-backed answer. Do not recommend bets.`;

    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a concise NBA betting analyst who never recommends bets. Only provide stat-based context and insights.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const systemMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'system',
        content: completion.data.choices[0].message?.content || "Sorry, I couldn't find an answer.",
        timestamp: Date.now(),
        confidence: betSlip.ocrResults.confidence
      };

      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, systemMessage]
      }));
    } catch (error) {
      const systemMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'system',
        content: 'Sorry, there was an error contacting the analysis engine.',
        timestamp: Date.now(),
        confidence: betSlip.ocrResults.confidence
      };
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, systemMessage]
      }));
    } finally {
      setIsTyping(false);
    }
  }, [betSlip]);

  return {
    session,
    sendMessage,
    isTyping
  };
}; 