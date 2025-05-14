import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOCR } from '../../hooks/useOCR';

interface FileUploadProps {
  onImageProcessed: (betSlip: BetSlip) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImageProcessed }) => {
  const { processImage, isProcessing, error } = useOCR();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const betSlip = await processImage(file);
      onImageProcessed(betSlip);
    } catch (err) {
      console.error('Failed to process image:', err);
    }
  }, [processImage, onImageProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <p>Processing image...</p>
      ) : isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <div>
          <p>Drag and drop your bet slip image here, or click to select</p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PNG, JPG, JPEG (max 10MB)
          </p>
        </div>
      )}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}; 