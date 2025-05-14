import OpenAI from 'openai';
import { ParsedSlip } from '../data/parser';

interface SessionContext {
  question: string;
  response: string;
}

export class ChatController {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({ apiKey });
    this.systemPrompt = `You are a concise NBA betting analyst who never recommends bets. 
    Your role is to critique user assumptions using real data. 
    Focus on providing 2-4 sentence insights about:
    - Matchup context
    - Player consistency
    - Recent trends
    - Risk factors
    
    Never make predictions or recommendations. Only provide factual analysis based on the data provided.`;
  }

  async analyze(parsedSlip: ParsedSlip, historicalData: any): Promise<string> {
    const prompt = this.constructAnalysisPrompt(parsedSlip, historicalData);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content || 'No analysis available';
  }

  async handleQuestion(
    question: string,
    parsedSlip: ParsedSlip,
    historicalData: any,
    sessionContext: SessionContext[]
  ): Promise<string> {
    const prompt = this.constructQuestionPrompt(question, parsedSlip, historicalData, sessionContext);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: this.systemPrompt },
        ...sessionContext.map(ctx => ({
          role: "user" as const,
          content: ctx.question
        })),
        ...sessionContext.map(ctx => ({
          role: "assistant" as const,
          content: ctx.response
        })),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content || 'No response available';
  }

  private constructAnalysisPrompt(parsedSlip: ParsedSlip, historicalData: any): string {
    return `Analyze the following bet slip and historical data:

Bet Slip:
${JSON.stringify(parsedSlip, null, 2)}

Historical Data:
${JSON.stringify(historicalData, null, 2)}

Please provide a concise analysis focusing on the key factors that might influence these outcomes.`;
  }

  private constructQuestionPrompt(
    question: string,
    parsedSlip: ParsedSlip,
    historicalData: any,
    sessionContext: SessionContext[]
  ): string {
    return `Given the following context and question:

Bet Slip:
${JSON.stringify(parsedSlip, null, 2)}

Historical Data:
${JSON.stringify(historicalData, null, 2)}

Question: ${question}

Please provide a concise, data-backed response.`;
  }
} 