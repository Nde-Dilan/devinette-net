'use client';

import { useState, useMemo } from 'react';
import type { Riddle } from '@/lib/types';
import { RiddleCard } from './RiddleCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ExploreRiddlesProps {
  initialRiddles: Riddle[];
  origins: string[];
  languages: string[];
}

export default function ExploreRiddles({
  initialRiddles,
  origins,
  languages,
}: ExploreRiddlesProps) {
  const [riddles] = useState<Riddle[]>(initialRiddles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredRiddles = useMemo(() => {
    return riddles
      .filter((riddle) =>
        riddle.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (riddle) =>
          selectedOrigin === 'all' || riddle.origin === selectedOrigin
      )
      .filter(
        (riddle) =>
          selectedLanguage === 'all' || riddle.language === selectedLanguage
      );
  }, [riddles, searchTerm, selectedOrigin, selectedLanguage]);

  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search riddles..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by origin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Origins</SelectItem>
            {origins.map((origin) => (
              <SelectItem key={origin} value={origin}>
                {origin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRiddles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRiddles.map((riddle) => (
            <RiddleCard key={riddle.id} riddle={riddle} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No riddles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
