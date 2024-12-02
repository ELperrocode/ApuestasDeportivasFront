import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MatchSearchProps {
  onSearch: (query: string) => void;
}

const MatchSearch = ({ onSearch }: MatchSearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-10"
        placeholder="Search matches by team name..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default MatchSearch;