import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDocument } from '../hooks/useDocument';
import { Download, Loader2, ArrowLeft } from 'lucide-react';

export function ResultPageV1() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
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
        <div className="max-w-5xl mx-auto py-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Your Spreadsheet is Ready
                </h1>
                {document.presigned_url && (
                  <a
                    href={document.presigned_url}
                    download
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Spreadsheet
                  </a>
                )}
              </div>
            </div>

            {/* Document Preview */}
            <div className="p-1 bg-gray-50">
              {document.presigned_url ? (
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