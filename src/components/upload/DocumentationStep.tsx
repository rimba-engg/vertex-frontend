import React from 'react';
import { FileText, X } from 'lucide-react';

interface DocumentationStepProps {
  docs: File[];
  instructions: string;
  onDocsUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDoc: (index: number) => void;
  onInstructionsChange: (value: string) => void;
  onBack: () => void;
  onProcess: () => void;
}

const MAX_DOCS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentationStep({
  docs,
  instructions,
  onDocsUpload,
  onRemoveDoc,
  onInstructionsChange,
  onBack,
  onProcess
}: DocumentationStepProps) {
  const remainingDocs = MAX_DOCS - docs.length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">Provide AI with attachments or supporting documents to generate a spreasheet.</p>
      </div>

      {/* supporting attachments */}
      <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Attachments <span className="text-red-500">*</span>
          </label>
          <span className="text-sm text-gray-500">
            {remainingDocs} of {MAX_DOCS} remaining
          </span>
        </div>
        <div className="space-y-2">
          {docs.map((doc, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{doc.name}</span>
                <span className="text-xs text-gray-400 ml-2">
                  ({(doc.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
              </div>
              <button
                onClick={() => onRemoveDoc(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.xls,.txt,.jpg,.jpeg,.png,.gif"
            onChange={onDocsUpload}
            className="hidden"
            id="docs-upload"
            disabled={docs.length >= MAX_DOCS}
          />
          <label
            htmlFor="docs-upload"
            className={`block text-center p-2 border border-gray-300 rounded ${
              docs.length >= MAX_DOCS
                ? 'bg-gray-100 cursor-not-allowed'
                : 'cursor-pointer hover:border-primary-500'
            } transition-colors`}
          >
            <span className="text-sm text-gray-600">
              {docs.length >= MAX_DOCS
                ? 'Maximum documents reached'
                : 'Attachments (PDF, DOCX, Excel, TXT, Images - Max 10MB each)'}
            </span>
          </label>
        </div>

      {/* Instructions Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Instructions
        </label>
        <textarea
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="What should the spreadsheet contain? Any specific attachment worth highlighting?"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onProcess}
          disabled={docs.length === 0}
          className={`flex-1 py-3 rounded-lg font-semibold ${
            docs.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-colors`}
        >
          Generate
        </button>
      </div>

      {docs.length === 0 && (
        <p className="text-sm text-red-500">
          Please upload at least one supporting document
        </p>
      )} 
    </div>
  );
}