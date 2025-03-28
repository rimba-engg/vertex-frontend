import React, { Suspense, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDocument } from '../hooks/useDocument';
import { Download, Loader2, ArrowLeft, ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/markdown.css';

export function ResultPageV1() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: document, isLoading, error } = useDocument(sessionId || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onNavigateHome={() => navigate('/')} />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Preparing your spreadsheet...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onNavigateHome={() => navigate('/')} />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
          <div className="text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-red-600 mb-6">Unable to load your spreadsheet</p>
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigateHome={() => navigate('/')} />
      <div className="flex-grow bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Document Section */}
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden flex-grow transition-all ${isDetailsOpen ? 'lg:w-2/3' : 'w-full'}`}>
              {/* Header Section */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Your Spreadsheet is Ready
                  </h1>
                  <div className="flex items-center gap-3">
                    {document?.template_filling_details && (
                      <button 
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="inline-flex items-center px-3 py-2 bg-white text-primary-600 rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        {isDetailsOpen ? (
                          <>
                            <ChevronRight className="w-4 h-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Show Details
                          </>
                        )}
                      </button>
                    )}
                    {document?.presigned_url && (
                      <a
                        href={document.presigned_url}
                        download
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="p-1 bg-gray-50">
                {document?.presigned_url ? (
                  <iframe
                    src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(document.presigned_url)}`}
                    className="w-full h-[70vh] border-0"
                    title="Document Preview"
                  ></iframe>
                ) : (
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-[70vh]">
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                  }>
                    <div className="flex items-center justify-center h-[70vh] text-gray-500">
                      Preview not available
                    </div>
                  </Suspense>
                )}
              </div>
            </div>
            
            {/* Template Filling Details Side Panel */}
            {isDetailsOpen && document?.template_filling_details && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:w-1/3 transition-all">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">
                    Template Filling Details
                  </h2>
                  <button 
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 bg-gray-50 markdown-content overflow-auto" style={{ height: 'calc(70vh + 56px)' }}>
                  <div className="prose max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {document.template_filling_details}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need help or want to discuss a specific use case?
            </p>
            <a 
              href="https://rimba.ai/request-demo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-primary-600 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}