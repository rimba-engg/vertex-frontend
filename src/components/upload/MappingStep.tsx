import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface Selection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

interface MappingStep {
  id: string;
  selection: Selection;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface MappingStepProps {
  tableData: TableData;
  onNext: (updatedTableData: TableData) => void;
}

export function MappingStep({ tableData, onNext }: MappingStepProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [mappings, setMappings] = useState<MappingStep[]>([]);
  const [localTableData, setLocalTableData] = useState<TableData>(tableData);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);

  const handleDownloadTemplate = () => {
    const csvContent = [
      localTableData.headers.join(','),
      ...localTableData.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setMouseDownTime(Date.now());
    setIsSelecting(true);
    setCurrentSelection({
      startRow: rowIndex,
      startCol: colIndex,
      endRow: rowIndex,
      endCol: colIndex
    });
  };

  const handleMouseMove = (rowIndex: number, colIndex: number) => {
    if (isSelecting && currentSelection) {
      setCurrentSelection(prev => ({
        ...prev!,
        endRow: rowIndex,
        endCol: colIndex
      }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && currentSelection) {
      const clickDuration = Date.now() - mouseDownTime;
      setIsSelecting(false);

      // If it's a quick click (less than 200ms), treat it as a toggle
      if (clickDuration < 200) {
        const rowIndex = currentSelection.startRow;
        const colIndex = currentSelection.startCol;
        
        // Toggle the cell
        if (localTableData.rows[rowIndex][colIndex] === 'FILL') {
          // Remove the fill
          const mappingToRemove = mappings.find(mapping => {
            const { startRow, endRow, startCol, endCol } = mapping.selection;
            return rowIndex >= startRow && rowIndex <= endRow && 
                   colIndex >= startCol && colIndex <= endCol;
          });

          if (mappingToRemove) {
            setLocalTableData(prev => {
              const newRows = [...prev.rows];
              newRows[rowIndex] = [...newRows[rowIndex]];
              newRows[rowIndex][colIndex] = tableData.rows[rowIndex][colIndex];
              return { ...prev, rows: newRows };
            });
            setMappings(prev => prev.filter(m => m.id !== mappingToRemove.id));
          }
        } else {
          // Add new fill
          const newMapping = {
            id: Math.random().toString(36).substr(2, 9),
            selection: {
              startRow: rowIndex,
              startCol: colIndex,
              endRow: rowIndex,
              endCol: colIndex
            }
          };

          setMappings(prev => [...prev, newMapping]);
          setLocalTableData(prev => {
            const newRows = [...prev.rows];
            newRows[rowIndex] = [...newRows[rowIndex]];
            newRows[rowIndex][colIndex] = 'FILL';
            return { ...prev, rows: newRows };
          });
        }
      } else {
        // It's a drag selection
        const normalizedSelection = {
          startRow: Math.min(currentSelection.startRow, currentSelection.endRow),
          startCol: Math.min(currentSelection.startCol, currentSelection.endCol),
          endRow: Math.max(currentSelection.startRow, currentSelection.endRow),
          endCol: Math.max(currentSelection.startCol, currentSelection.endCol)
        };

        // Add to mappings
        setMappings(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          selection: normalizedSelection
        }]);

        // Update table data to show "FILL"
        setLocalTableData(prev => {
          const newRows = [...prev.rows];
          for (let i = normalizedSelection.startRow; i <= normalizedSelection.endRow; i++) {
            for (let j = normalizedSelection.startCol; j <= normalizedSelection.endCol; j++) {
              if (newRows[i][j] !== 'FILL') { // Only fill if not already filled
                newRows[i] = [...newRows[i]];
                newRows[i][j] = 'FILL';
              }
            }
          }
          return { ...prev, rows: newRows };
        });
      }

      setCurrentSelection(null);
    }
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (!currentSelection) return false;
    
    const minRow = Math.min(currentSelection.startRow, currentSelection.endRow);
    const maxRow = Math.max(currentSelection.startRow, currentSelection.endRow);
    const minCol = Math.min(currentSelection.startCol, currentSelection.endCol);
    const maxCol = Math.max(currentSelection.startCol, currentSelection.endCol);

    return rowIndex >= minRow && rowIndex <= maxRow && 
           colIndex >= minCol && colIndex <= maxCol;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">Select cells in the table that need to be filled by AI.</p>
      </div>

      {/* Table Section with sticky header */}
      <div className="border border-gray-200 rounded-lg">
        <div className="relative">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr>
                  {localTableData.headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto max-h-[60vh]">
            <table 
              className="min-w-full"
              onMouseLeave={() => {
                setIsSelecting(false);
                setCurrentSelection(null);
              }}
            >
              <tbody className="bg-white divide-y divide-gray-200">
                {localTableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => {
                      const isSelected = isCellSelected(rowIndex, colIndex);
                      const isFill = cell === 'FILL';

                      return (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r last:border-r-0 select-none
                            ${isSelected ? 'bg-primary-100' : ''}
                            ${isFill ? 'bg-green-100' : ''}
                            cursor-cell
                          `}
                          onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                          onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                          onMouseUp={handleMouseUp}
                        >
                          {cell}
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

      <div className="flex gap-4">
        <button
          onClick={handleDownloadTemplate}
          className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
        <button
          onClick={() => onNext(localTableData)}
          disabled={!mappings.length}
          className={`flex-1 py-3 rounded-lg font-semibold ${
            mappings.length
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-colors`}
        >
          Next Step
        </button>
      </div>

      {!mappings.length && (
        <p className="text-sm text-red-500">
          Please select at least one cell to fill
        </p>
      )}
    </div>
  );
}