import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingModal({ isOpen, message = "Processing your request..." }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600 text-center">
            {message}
            <br />
            <span className="text-sm text-gray-500">This might take 1-2 minutes</span>
          </p>
        </div>
      </div>
    </div>
  );
}