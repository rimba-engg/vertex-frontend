import React, { useState, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import './TemplateStep.css';

interface TemplateResponse {
  template_contents: string;
}

interface TemplateStepProps {
  template: File | null;
  onTemplateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onTableData: (htmlContent: string) => void;
}

export function TemplateStep({ template, onTemplateUpload, onTableData }: TemplateStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tableHtml, setTableHtml] = useState<string | null>(null);

  const processTemplate = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('check_for_moderation', 'true');

      const response = await api.post('/upload/template', formData);
      const data = response as TemplateResponse;
      
      if (data.template_contents) {
        setTableHtml(data.template_contents);
        onTableData(data.template_contents);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error processing template:', error);
      alert('Error processing template. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase());
    const isImage = /\.(jpg|jpeg|png|gif)$/.test(file.name.toLowerCase()) || file.type.startsWith('image/');
    
    if (!isExcel && !isImage) {
      alert('Please upload either an Excel file (.xlsx, .xls) or an image file (.jpg, .jpeg, .png, .gif)');
      return;
    }

    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    // Create a synthetic event to match the expected type
    const syntheticEvent = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onTemplateUpload(syntheticEvent);
    await processTemplate(file);
  };

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      
      // Handle image paste
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        const file = files[0];
        await processFile(file);
        return;
      }

      // Handle Excel data paste (not implemented yet as it requires additional processing)
      // This would need server-side support to handle Excel-formatted clipboard data
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">Upload your Excel template. Or upload a screenshot of your table & AI will create one for you.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Template File <span className="text-red-500">*</span>
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.jpg,.jpeg,.png,.gif"
            onChange={handleFileUpload}
            className="hidden"
            id="template-upload"
          />
          <label htmlFor="template-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {template ? template.name : 'Click to upload, drag and drop, or paste from clipboard'}
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: Excel (.xlsx, .xls) or Images (.jpg, .jpeg, .png, .gif)
            </p>
          </label>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-primary-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing {template?.name}...</span>
          </div>
        </div>
      )}

      {/* Table Preview */}
      {tableHtml && (
        <div className="mt-6 border rounded-lg p-4 overflow-x-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Template Preview</h3>
          <div 
            className="template-table"
            dangerouslySetInnerHTML={{ __html: tableHtml }}
          />
        </div>
      )}

      {!template && (
        <p className="text-sm text-red-500">
          Please upload a template file to continue
        </p>
      )}
    </div>
  );
}