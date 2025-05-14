import { ChatInterface } from './components/Chat/ChatInterface';
import { useChat } from './hooks/useChat';

// Temporary mock bet slip for testing
const mockBetSlip = {
  id: '1',
  imageUrl: '',
  ocrResults: {
    text: 'Sample bet slip text',
    confidence: 0.85,
    verified: true
  },
  bets: [],
  timestamp: Date.now()
};

const App = () => {
  const { session, sendMessage, isTyping } = useChat(mockBetSlip);

  return (
    <div className="h-screen flex flex-col">
      <ChatInterface
        betSlip={session.betSlip!}
        messages={session.messages}
        isTyping={isTyping}
        onSendMessage={sendMessage}
      />
    </div>
  );
};

export default App; 