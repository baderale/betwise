interface SessionContext {
  question: string;
  response: string;
}

export class SessionManager {
  private context: SessionContext[];

  constructor() {
    this.context = [];
  }

  addToContext(question: string, response: string): void {
    this.context.push({ question, response });
  }

  getSessionContext(): SessionContext[] {
    return this.context;
  }

  clearContext(): void {
    this.context = [];
  }
} 