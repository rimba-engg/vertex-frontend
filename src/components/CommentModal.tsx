import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  selection: {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null;
}

export function CommentModal({ isOpen, onClose, onSubmit, selection }: CommentModalProps) {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {selection && (
          <p className="text-sm text-gray-600 mb-4">
            Selected cells: ({selection.startRow + 1}, {selection.startCol + 1}) to ({selection.endRow + 1}, {selection.endCol + 1})
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
            placeholder="Enter your comment..."
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}