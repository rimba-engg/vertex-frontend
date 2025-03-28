import { useState } from 'react';
import { api } from '../utils/api';
import { getSessionId } from '../utils/session';

export function useProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processData = async (
    supportingFiles: File[],
    email: string,
    instructions: string,
    mappingData: string[]
  ) => {
    if (supportingFiles.length === 0 || !email) return;
    
    setIsProcessing(true);
    const sessionId = getSessionId();

    try {
      // Step 1: Upload attachments
      setProcessingStep('Uploading supporting files...');
      const formData = new FormData();
      supportingFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('check_for_moderation', 'true');
      
      const uploadResponse = await api.post('/upload/attachment', formData);
      if (uploadResponse.status === 500) throw new Error('Failed to upload attachments');

      // Step 2: Specify template mapping using the selected cell IDs.
      setProcessingStep('Processing template mapping...');
      const formData1 = new FormData();
      const template_contents = JSON.stringify(mappingData);
      formData1.append('template_contents', template_contents);
      
      const templateResponse = await api.post('/template/specify', formData1);
      if (templateResponse.status === 500) throw new Error('Failed to process template');

      // Step 3: Configure
      setProcessingStep('Configuring...');
      const formData2 = new FormData();
      formData2.append('email', email);
      formData2.append('instructions', instructions);
      const configResponse = await api.post('/config', formData2);
      if (configResponse.status === 500) throw new Error('Failed to configure');

      // Step 4: Run
      setProcessingStep('Starting process...');
      const formData3 = new FormData();
      const runResponse = await api.post('/run', formData3);
      if (runResponse.status === 500) throw new Error('Failed to start process');

      return true;
    } catch (error) {
      console.error('Processing error:', error);
      setUploadError(error instanceof Error ? error.message : 'An error occurred during processing');
      return false;
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return {
    isProcessing,
    processingStep,
    uploadError,
    setUploadError,
    processData
  };
}