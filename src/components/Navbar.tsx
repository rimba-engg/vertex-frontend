import React from 'react';
import { Leaf } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
}

export function Navbar({ onNavigateHome }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <button 
            onClick={onNavigateHome}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <img src="https://cmlvdwcarxngwmualiyn.supabase.co/storage/v1/object/public/vertex-assets//logo-only-white.png" alt="Rimba" className="h-8" />
            <span className="text-xl font-bold">Vertex</span>
          </button>
        </div>
      </div>
    </nav>
  );
}