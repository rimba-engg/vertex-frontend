import React from 'react';
import { FileUp, ThumbsUp, FileOutput, RefreshCw, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FeatureCard } from '../components/FeatureCard';
import { TableData, demoTables } from '../constants/demoTables';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const renderTable = (data: TableData, highlight?: string) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    cell === highlight
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-900'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigateHome={() => {}} />
      <div className="flex-grow bg-gradient-to-b from-primary-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Screenshots To Excel,
              <span className="text-primary-600"> using AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload a screenshot or template, and let Vertex create spreadsheets. <br/>
              Preserve formatting while AI fills the data you need.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center"
              >
                Create Your Table Now
                <ArrowRight className="ms-2 w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo */}
        <div className="container mx-auto px-4 py-16 bg-white rounded-t-3xl shadow-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">See It In Action</h2>
            <p className="text-lg text-gray-600 mb-8">
              Watch a quick demo of how Vertex transforms your screenshots and templates into dynamic spreadsheets
            </p>
            <div className="relative w-full" style={{ paddingBottom: '62.5%' }}>
              <iframe
                src="https://www.loom.com/embed/33b290dbe12b4afba23dd1c6b5cc26d9?sid=66fba81d-bb01-456a-b9cc-25b3dec9c94c"
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white container mx-auto px-4 py-16 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How Vertex Works
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-2 items-center">
              {/* Step 1: Initial Template */}
              <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Upload Image or Template</h3>
                </div>
                {renderTable(demoTables.initial)}
              </div>

              {/* Arrow 1 */}
              <div className="lg:col-span-1 flex justify-center">
                <ArrowRight className="w-6 h-6 text-primary-600" />
              </div>

              {/* Step 2: Selection */}
              <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Select Cells</h3>
                </div>
                {renderTable(demoTables.selected, 'FILL')}
              </div>

              {/* Arrow 2 */}
              <div className="lg:col-span-1 flex justify-center">
                <ArrowRight className="w-6 h-6 text-primary-600" />
              </div>

              {/* Step 3: Result */}
              <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">AI Generates</h3>
                </div>
                {renderTable(demoTables.completed)}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={FileUp}
              title="Screenshot to Excel"
              description="Upload a screenshot and let AI create a perfect Excel template, or start with your own template."
            />
            <FeatureCard
              icon={ThumbsUp}
              title="AI That Learns"
              description="Every piece of feedback helps the AI improve, creating better outputs tailored to your needs."
            />
            <FeatureCard
              icon={FileOutput}
              title="Export & Share"
              description="Export your AI-enhanced documents in their original format, ready for immediate use."
            />
            <FeatureCard
              icon={RefreshCw}
              title="Iterative Refinement"
              description="Fine-tune outputs through multiple iterations until they match your exact requirements."
            />
          </div>
        </div>

        {/* Demo Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">See Vertex in Action</h2>
                <p className="text-gray-600 mb-8">
                  Watch how Vertex transforms screenshots into dynamic, data-driven Excel files 
                  in minutes. Experience the power of AI-driven document generation while maintaining 
                  complete control over the output.
                </p>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Schedule Demo
                </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}