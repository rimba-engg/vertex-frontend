import React from 'react';
import { X } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  selection: {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  };
  timestamp?: string;
}

interface CommentThreadProps {
  comments: Comment[];
  onDeleteComment: (id: string) => void;
}

export function CommentThread({ 
  comments, 
  onDeleteComment
}: CommentThreadProps) {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              {comment.timestamp && (
                <span className="text-xs text-gray-400 mb-2 block">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              )}
              <p className="text-gray-900">{comment.text}</p>
            </div>
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete comment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}