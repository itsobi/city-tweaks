'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';
export function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    // Use React Select for the search input
    <Input placeholder="Search for City Tweak" className="w-full" />
  );
}
