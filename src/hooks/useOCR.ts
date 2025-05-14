import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { BetSlip } from '../types/bet';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (imageFile: File): Promise<BetSlip> => {
    setIsProcessing(true);
    setError(null);

    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text, confidence } } = await worker.recognize(imageFile);
      await worker.terminate();

      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(imageFile);

      return {
        id: crypto.randomUUID(),
        imageUrl,
        ocrResults: {
          text,
          confidence: confidence / 100, // Convert to 0-1 scale
          verified: false
        },
        bets: [], // Will be populated by bet parsing logic
        timestamp: Date.now()
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processImage,
    isProcessing,
    error
  };
}; 