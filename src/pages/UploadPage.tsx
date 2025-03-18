import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmailModal } from '../components/EmailModal';
import { SuccessModal } from '../components/SuccessModal';
import { LoadingModal } from '../components/LoadingModal';
import { TemplateStep } from '../components/upload/TemplateStep';
import { MappingStep, TableData } from '../components/upload/MappingStep';
import { DocumentationStep } from '../components/upload/DocumentationStep';
import { FileUp, Map, FileText, X } from 'lucide-react';
import { useProcessing } from '../hooks/useProcessing';
import { usePolling } from '../hooks/usePolling';
import { resetSessionId, getSessionId } from '../utils/session';
import { useNavigate } from 'react-router-dom';

interface UploadState {
  template: File | null;
  docs: File[];
  instructions: string;
  tableHTML?: string;
  mappingData?: string[];
  mappingComplete: boolean;
}

interface UploadPageProps {
  onComplete: () => void;
  setCurrentStep: (step: string) => void;
}

type TabType = 'template' | 'mapping' | 'documentation';

export function UploadPage({ onComplete, setCurrentStep }: UploadPageProps) {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>({
    template: null,
    docs: [],
    instructions: '',
    mappingComplete: false
  });
  const [currentTab, setCurrentTab] = useState<TabType>('template');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    isProcessing,
    processingStep,
    uploadError,
    setUploadError,
    processData
  } = useProcessing();

  const { showProcessingModal, startPolling } = usePolling({
    onSuccess: () => {
      navigate(`/document/${getSessionId()}`);
    },
    onTimeout: () => {
      setShowSuccessModal(true);
    }
  });

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase());
      const isImage = /\.(jpg|jpeg|png|gif)$/.test(file.name.toLowerCase());
      
      if (!isExcel && !isImage) {
        alert('Please upload either an Excel file (.xlsx, .xls) or an image file (.jpg, .jpeg, .png, .gif)');
        e.target.value = '';
        return;
      }
      
      setUploadState(prev => ({ ...prev, template: file }));
    }
  };

  const handleTableDataReceived = (htmlContent: string) => {
    setUploadState(prev => ({ ...prev, tableHTML: htmlContent }));
    setCurrentTab('mapping');
  };

  const handleDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        const isValidType = ['pdf', 'docx', 'xlsx', 'xls', 'txt', 'jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

        if (!isValidType) {
          alert(`File "${file.name}" is not a supported file type`);
          return false;
        }
        if (!isValidSize) {
          alert(`File "${file.name}" exceeds the maximum size of 10MB`);
          return false;
        }

        return true;
      });

      setUploadState(prev => ({ ...prev, docs: [...prev.docs, ...validFiles] }));
    }
  };

  const handleProcessTemplate = () => {
    if (!uploadState.template || !uploadState.tableHTML) {
      alert('Please upload a template first');
      return;
    }

    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email);
    
    if (!uploadState.mappingData) {
      setUploadError('No mapping data available');
      return;
    }

    const success = await processData(
      uploadState.docs,
      email,
      uploadState.mappingData
    );

    if (success) {
      startPolling();
      setShowEmailModal(false);
    }
  };

  const handleMappingComplete = (updatedTableData: TableData) => {
    setUploadState(prev => ({ 
      ...prev, 
      mappingComplete: true,
      tableHTML: updatedTableData.tableHTML
    }));
    setCurrentTab('documentation');
  };

  const tabs = [
    {
      id: 'template' as TabType,
      label: 'Creation',
      icon: FileUp,
      isComplete: !!uploadState.template
    },
    {
      id: 'mapping' as TabType,
      label: 'Mapping',
      icon: Map,
      isComplete: uploadState.mappingComplete
    },
    {
      id: 'documentation' as TabType,
      label: 'Generation',
      icon: FileText,
      isComplete: uploadState.docs.length > 0
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigateHome={() => setCurrentStep('landing')} />
      <div className="flex-grow bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto pt-8 px-4">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            {/* Tabs Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    const isPrevious = tabs.findIndex(t => t.id === currentTab) > index;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`
                          group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-sm font-medium text-center
                          ${isActive 
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : isPrevious && tab.isComplete
                              ? 'text-primary-600 hover:text-primary-700 hover:border-primary-200'
                              : 'text-gray-500 hover:text-gray-700 hover:border-gray-200'
                          }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                          {tab.isComplete && !isActive && (
                            <span className="bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {currentTab === 'template' && (
                <TemplateStep
                  template={uploadState.template}
                  onTemplateUpload={handleTemplateUpload}
                  onNext={() => {}}
                  onTableData={handleTableDataReceived}
                />
              )}
              {currentTab === 'mapping' && uploadState.tableHTML && (
                <MappingStep
                  tableHTML={uploadState.tableHTML}
                  onNext={(selectedMapping: string[]) => {
                    setUploadState(prev => ({
                      ...prev,
                      mappingComplete: true,
                      mappingData: selectedMapping
                    }));
                    setCurrentTab('documentation');
                  }}
                />
              )}
              {currentTab === 'documentation' && (
                <DocumentationStep
                  docs={uploadState.docs}
                  instructions={uploadState.instructions}
                  onDocsUpload={handleDocsUpload}
                  onRemoveDoc={(index) => setUploadState(prev => ({
                    ...prev,
                    docs: prev.docs.filter((_, i) => i !== index)
                  }))}
                  onInstructionsChange={(value) => setUploadState(prev => ({
                    ...prev,
                    instructions: value
                  }))}
                  onBack={() => setCurrentTab('mapping')}
                  onProcess={handleProcessTemplate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <EmailModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isProcessing={isProcessing}
      />
      <LoadingModal 
        isOpen={showProcessingModal}
        message="Processing your spreadsheet..."
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onComplete();
        }}
        email={userEmail}
      />
      {uploadError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{uploadError}</p>
          <button 
            onClick={() => setUploadError(null)}
            className="absolute top-0 right-0 p-2"
          >
            <span className="sr-only">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}