'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
export function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="relative">
      <div className="flex items-center gap-1 border border-gray-200 rounded-full p-2 focus-within:border-gray-200 focus-within:ring-1 focus-within:ring-gray-200 bg-white relative z-10">
        <Search className="text-gray-400" />
        <input
          placeholder="Search for City Tweak"
          className="border-none w-full focus:outline-none focus:ring-0 focus:shadow-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm && (
        <div className="absolute top-[calc(100%-4px)] left-0 w-full border border-gray-200 rounded-lg z-0 bg-white shadow-lg mt-1 py-2">
          <p className="px-4 py-2 hover:bg-gray-100">option 1</p>
          <p className="px-4 py-2 hover:bg-gray-100">option 2</p>
          <p className="px-4 py-2 hover:bg-gray-100">option 3</p>
        </div>
      )}
    </div>
  );
}
