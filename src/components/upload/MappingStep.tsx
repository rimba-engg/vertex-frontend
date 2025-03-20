import React, { useEffect, useRef, useState } from 'react';
// Removed unused import of Download if not needed
// import { Download } from 'lucide-react';

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

export interface TableData {
  headers: string[];
  rows: string[][];
}

interface MappingStepProps {
  tableHTML: string;
  onNext: (selectedMapping: string[]) => void;
}

export function MappingStep({ tableHTML, onNext }: MappingStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  // Removed all drag-selection and tableData-related state:
  // const [isSelecting, setIsSelecting] = useState(false);
  // const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  // const [mappings, setMappings] = useState<MappingStep[]>([]);
  // const [localTableData, setLocalTableData] = useState<TableData>(tableData);
  // const [mouseDownTime, setMouseDownTime] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      // Render the raw HTML table.
      containerRef.current.innerHTML = tableHTML;

      // Attach click event handlers to each <td>.
      const tdElements = containerRef.current.querySelectorAll('td');
      tdElements.forEach(td => {
        td.addEventListener('click', handleCellClick);
      });

      // Cleanup listeners on unmount/update.
      return () => {
        tdElements.forEach(td => {
          td.removeEventListener('click', handleCellClick);
        });
      };
    }
  }, [tableHTML]);
  useEffect(() => {
    console.log('Selected cells:', selectedCells);
  }, [selectedCells]);

  const handleCellClick = (event: MouseEvent) => {
    const cell = event.currentTarget as HTMLElement;
    const cellId = cell.getAttribute('id');
    if (!cellId) return;

    if (cell.classList.contains('selected')) {
      // When deselecting, remove the class and restore the original text.
      cell.classList.remove('selected');
      const originalText = cell.getAttribute('data-original-text');
      if (originalText !== null) {
        cell.innerText = originalText;
      }
      setSelectedCells((prev) => prev.filter(id => id !== cellId));
    } else {
      // When selecting, store the original text (if not already stored),
      // replace the cell text with "FILL" and add the "selected" class.
      if (!cell.hasAttribute('data-original-text')) {
        cell.setAttribute('data-original-text', cell.innerText);
      }
      cell.innerText = "FILL";
      cell.classList.add('selected');
      setSelectedCells((prev) => [...prev, cellId]);
    }
  };

  const handleNext = () => {
    onNext(selectedCells);
    console.log(selectedCells)
  };

  return (
    <div className="space-y-4">
      <h2>Mapping Step</h2>
      <p>Select the table cells you wish to map.</p>
      {/* Render the table via innerHTML */}
      <div ref={containerRef} />
      <button onClick={handleNext} className="btn btn-primary">
        Next
      </button>
    </div>
  );
}