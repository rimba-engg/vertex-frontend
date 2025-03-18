import React, { useState } from 'react';
import { X, Loader2, Mail } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isProcessing: boolean;
}

export function EmailModal({ isOpen, onClose, onSubmit, isProcessing }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Almost there!</h3>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isProcessing ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your request...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Please enter your email address. Promise we won't spam.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      error ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="you@example.com"
                    disabled={isProcessing}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!email.trim() || isProcessing}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}