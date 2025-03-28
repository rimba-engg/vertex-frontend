import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export interface DocumentData {
  headers: string[];
  rows: string[][];
  feedback: {
    id: string;
    text: string;
    selection: {
      startRow: number;
      startCol: number;
      endRow: number;
      endCol: number;
    };
    timestamp: string;
  }[];
  generalFeedback: string;
  feedbackState: 'initial' | 'positive' | 'negative';
  presigned_url?: string;
  template_filling_details?: string;
}

export function useDocument(sessionId: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = async () => {
    try {
      setIsLoading(true);
      
      // First get the presigned URL
      const response = await api.get('/result', { params: { session_id: sessionId } });
      
      if (!response) {
        throw new Error('No response received');
      }

      // Set the document data with the presigned URL
      setData({
        headers: [],
        rows: [],
        feedback: [],
        generalFeedback: '',
        feedbackState: 'initial',
        presigned_url: response.presigned_url,
        template_filling_details: response?.template_filling_details
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchDocument();
    }
  }, [sessionId]);

  return { data, isLoading, error, refetch: fetchDocument };
}