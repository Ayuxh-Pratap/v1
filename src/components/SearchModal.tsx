'use client';

import { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
  currentSearch?: string;
}

export default function SearchModal({ isOpen, onClose, onSearch, currentSearch = '' }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(currentSearch);
      setIsAnimating(true);
      // Focus the input after animation
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 100);
    }
  }, [isOpen, currentSearch]);

  const handleSearch = () => {
    onSearch(searchTerm);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    onClose();
  };

  if (!isOpen) return null;

  console.log('SearchModal rendering, isOpen:', isOpen);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md mx-4 transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-neutral-900/95 backdrop-blur-xl ring-1 ring-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
                <Search className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-100">Search Complaints</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 ring-1 ring-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
              <input
                id="search-input"
                type="text"
                placeholder="Search by complaint type, descriptor, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 bg-neutral-800/70 ring-1 ring-white/10 rounded-xl text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none text-sm"
              />
            </div>

            {/* Search Suggestions */}
            <div className="space-y-2">
              <p className="text-xs text-neutral-400 font-medium">Quick searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Noise', 'Heat', 'Water', 'Street', 'Parking'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchTerm(suggestion)}
                    className="px-3 py-1 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg text-xs text-neutral-300 hover:text-neutral-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-xl text-sm font-medium text-white transition-colors"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
                Search
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              
              {currentSearch && (
                <button
                  onClick={handleClear}
                  className="px-4 py-3 bg-neutral-800/70 hover:bg-neutral-700/70 ring-1 ring-white/10 rounded-xl text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Current Search Display */}
            {currentSearch && (
              <div className="p-3 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-xl">
                <p className="text-xs text-emerald-400 font-medium mb-1">Current search:</p>
                <p className="text-sm text-emerald-300">&ldquo;{currentSearch}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
