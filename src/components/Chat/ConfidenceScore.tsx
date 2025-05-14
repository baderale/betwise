interface ConfidenceScoreProps {
  score: number;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLabel = (score: number) => {
    if (score >= 0.9) return 'High Confidence';
    if (score >= 0.7) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`text-sm font-medium ${getColor(score)}`}>
        {getLabel(score)}
      </div>
      <div className="text-xs text-gray-500">
        ({(score * 100).toFixed(1)}%)
      </div>
    </div>
  );
}; 