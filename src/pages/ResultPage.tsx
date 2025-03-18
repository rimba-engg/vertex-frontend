import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ThumbsUp, ThumbsDown, RefreshCw, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CommentModal } from '../components/CommentModal';
import { CommentThread } from '../components/CommentThread';
import { useDocument } from '../hooks/useDocument';

interface Selection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDocument(sessionId || '');

  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load document</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsSelecting(true);
    setSelection({
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex
    });
  };

  const handleMouseMove = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selection) {
      setSelection(prev => ({
        ...prev!,
        endRow: rowIndex,
        endCol: colIndex
      }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selection) {
      setIsSelecting(false);
      setShowFeedbackModal(true);
    }
  };

  const handleAddFeedback = async (text: string) => {
    if (!selection || !sessionId) return;

    try {
      await api.post('/feedback', {
        sessionId,
        feedback: {
          text,
          selection: {
            startRow: Math.min(selection.startRow, selection.endRow),
            startCol: Math.min(selection.startCol, selection.endCol),
            endRow: Math.max(selection.startRow, selection.endRow),
            endCol: Math.max(selection.startCol, selection.endCol)
          }
        }
      });

      setShowFeedbackModal(false);
      setSelection(null);
      // Refetch the document to get updated feedback
      window.location.reload();
    } catch (error) {
      console.error('Failed to add feedback:', error);
      alert('Failed to add feedback. Please try again.');
    }
  };

  const isCellInSelection = (rowIndex: number, colIndex: number) => {
    if (!selection) return false;
    
    const minRow = Math.min(selection.startRow, selection.endRow);
    const maxRow = Math.max(selection.startRow, selection.endRow);
    const minCol = Math.min(selection.startCol, selection.endCol);
    const maxCol = Math.max(selection.startCol, selection.endCol);

    return rowIndex >= minRow && rowIndex <= maxRow && 
           colIndex >= minCol && colIndex <= maxCol;
  };

  const isCellInFeedback = (rowIndex: number, colIndex: number) => {
    return data.feedback.some(feedback => {
      const { startRow, endRow, startCol, endCol } = feedback.selection;
      return rowIndex >= startRow && rowIndex <= endRow && 
             colIndex >= startCol && colIndex <= endCol;
    });
  };

  const getCellFeedback = (rowIndex: number, colIndex: number) => {
    return data.feedback.find(feedback => {
      const { startRow, endRow, startCol, endCol } = feedback.selection;
      return rowIndex >= startRow && rowIndex <= endRow && 
             colIndex >= startCol && colIndex <= endCol;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigateHome={() => navigate('/')} />
      <div className="flex-grow bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-6xl mx-auto pt-8 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            {/* Excel-like Preview */}
            <div className="overflow-x-auto mb-8">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table 
                    className="min-w-full divide-y divide-gray-200"
                    onMouseLeave={() => setIsSelecting(false)}
                  >
                    <thead className="bg-gray-50">
                      <tr>
                        {data.headers.map((header, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, colIndex) => {
                            const isSelected = isCellInSelection(rowIndex, colIndex);
                            const hasFeedback = isCellInFeedback(rowIndex, colIndex);
                            const feedback = getCellFeedback(rowIndex, colIndex);

                            return (
                              <td
                                key={colIndex}
                                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r last:border-r-0 select-none
                                  ${isSelected ? 'bg-primary-100' : ''}
                                  ${hasFeedback ? 'bg-yellow-100' : ''}
                                  ${hasFeedback ? 'cursor-help' : 'cursor-cell'}
                                  relative group
                                `}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                              >
                                {cell}
                                {hasFeedback && feedback && (
                                  <div className="hidden group-hover:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                    {feedback.text}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            {data.feedback.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Cell Feedback</h3>
                    <span className="text-sm text-gray-500">
                      ({data.feedback.length})
                    </span>
                  </div>
                </div>
                <CommentThread
                  comments={data.feedback}
                  onDeleteComment={() => {}}
                />
              </div>
            )}

            {/* Feedback Modal */}
            <CommentModal
              isOpen={showFeedbackModal}
              onClose={() => {
                setShowFeedbackModal(false);
                setSelection(null);
              }}
              onSubmit={handleAddFeedback}
              selection={selection}
            />

            {/* Download Section */}
            <div className="flex justify-center">
              <button 
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                onClick={() => {
                  // Handle download
                }}
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}