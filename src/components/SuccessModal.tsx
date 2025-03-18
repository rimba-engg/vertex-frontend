import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function SuccessModal({ isOpen, onClose, email }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Received!</h3>
        <p className="text-gray-600 mb-6">
          We'll send your generated spreadsheet to <span className="font-medium">{email}</span> once it's ready. Feel free to close this window.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}