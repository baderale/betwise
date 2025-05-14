import { ChatMessage } from '../../types/chat';
import { ConfidenceScore } from './ConfidenceScore';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isSystem = message.type === 'system';

  return (
    <div className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isSystem
            ? 'bg-white border border-gray-200'
            : 'bg-blue-500 text-white'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        
        {/* Show confidence score for system messages */}
        {isSystem && message.confidence !== undefined && (
          <div className="mt-2">
            <ConfidenceScore score={message.confidence} />
          </div>
        )}
        
        <div
          className={`text-xs mt-1 ${
            isSystem ? 'text-gray-500' : 'text-blue-100'
          }`}
        >
          {format(message.timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
}; 