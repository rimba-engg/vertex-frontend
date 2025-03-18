import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getSessionId } from '../utils/session';

interface UsePollingOptions {
  onSuccess: () => void;
  onTimeout: () => void;
  timeoutMs?: number;
  intervalMs?: number;
}

export function usePolling({
  onSuccess,
  onTimeout,
  timeoutMs = 120000, // 2 minutes default
  intervalMs = 10000,  // 10 seconds default
}: UsePollingOptions) {
  const [isPolling, setIsPolling] = useState(false);
  const [pollStartTime, setPollStartTime] = useState<number | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const formData = new FormData();
        const response = await api.post('/status', formData);
        console.log(response);
        console.log(pollStartTime);
        console.log(Date.now() - pollStartTime);

        if (response['status'] === 'completed') {
          // Stop polling and trigger success callback
          setIsPolling(false);
          setShowProcessingModal(false);
          onSuccess();
        } else if (pollStartTime && Date.now() - pollStartTime > timeoutMs) {
          // If more than timeout duration has passed
          setIsPolling(false);
          setShowProcessingModal(false);
          onTimeout();
        }
      } catch (error) {
        console.error('Error checking status:', error);
        // On error, stop polling and trigger timeout callback
        setIsPolling(false);
        setShowProcessingModal(false);
        onTimeout();
      }
    };

    if (isPolling) {
      pollInterval = setInterval(checkStatus, intervalMs);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isPolling, pollStartTime, timeoutMs, intervalMs, onSuccess, onTimeout]);

  const startPolling = () => {
    setIsPolling(true);
    setShowProcessingModal(true);
    setPollStartTime(Date.now());
  };

  const stopPolling = () => {
    setIsPolling(false);
    setShowProcessingModal(false);
    setPollStartTime(null);
  };

  return {
    isPolling,
    showProcessingModal,
    startPolling,
    stopPolling
  };
}