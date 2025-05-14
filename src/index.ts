import { Command } from 'commander';
import inquirer from 'inquirer';
import { BetSlipParser } from './data/parser';
import { SportradarClient } from './data/sportradar';
import { ChatController } from './chat/controller';
import { SessionManager } from './session/manager';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const program = new Command();

async function main() {
  program
    .name('betwise')
    .description('AI-powered NBA betting analysis assistant')
    .version('1.0.0');

  program
    .command('analyze')
    .description('Analyze a FanDuel bet slip')
    .action(async () => {
      const { betSlip } = await inquirer.prompt([
        {
          type: 'input',
          name: 'betSlip',
          message: 'Paste your FanDuel bet slip:',
          validate: (input: string) => input.length > 0
        }
      ]);

      const parser = new BetSlipParser();
      const sportradar = new SportradarClient();
      const chatController = new ChatController();
      const sessionManager = new SessionManager();

      try {
        const parsedSlip = parser.parse(betSlip);
        const historicalData = await sportradar.fetchPlayerData(parsedSlip);
        const analysis = await chatController.analyze(parsedSlip, historicalData);
        
        console.log('\nAnalysis:');
        console.log(analysis);

        // Start interactive Q&A session
        await startQASession(parsedSlip, historicalData, chatController, sessionManager);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'An unknown error occurred');
      }
    });

  await program.parseAsync();
}

async function startQASession(
  parsedSlip: any,
  historicalData: any,
  chatController: ChatController,
  sessionManager: SessionManager
) {
  while (true) {
    const { question } = await inquirer.prompt([
      {
        type: 'input',
        name: 'question',
        message: '\nAsk a follow-up question (or type "exit" to quit):',
      }
    ]);

    if (question.toLowerCase() === 'exit') break;

    const response = await chatController.handleQuestion(
      question,
      parsedSlip,
      historicalData,
      sessionManager.getSessionContext()
    );
    
    console.log('\nResponse:', response);
    sessionManager.addToContext(question, response);
  }
}

main().catch(console.error); 