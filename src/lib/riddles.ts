import type { Riddle } from './types';

export const riddles: Riddle[] = [
  {
    id: '1',
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    answer: 'A map',
    origin: 'Nigeria',
    language: 'English',
    category: 'Logic',
  },
  {
    id: '2',
    question: 'What has an eye, but cannot see?',
    answer: 'A needle',
    origin: 'Ghana',
    language: 'English',
    category: 'Object',
  },
  {
    id: '3',
    question: 'I walk without feet and I cry without eyes. What am I?',
    answer: 'The rain',
    origin: 'Cameroon',
    language: 'English',
    category: 'Nature',
  },
  {
    id: '4',
    question: 'What is always on its way but never arrives?',
    answer: 'Tomorrow',
    origin: 'Ethiopia',
    language: 'Amharic',
    category: 'Abstract',
  },
  {
    id: '5',
    question: 'A small, round house, and it is full of meat.',
    answer: 'A groundnut (peanut)',
    origin: 'Senegal',
    language: 'Wolof',
    category: 'Food',
  },
   {
    id: '6',
    question: 'My house has no door.',
    answer: 'An egg',
    origin: 'Kenya',
    language: 'Swahili',
    category: 'Food',
  },
  {
    id: '7',
    question: "What walks on four feet in the morning, two in the afternoon and three at night?",
    answer: 'A man (crawls as a baby, walks as an adult, uses a cane in old age)',
    origin: 'Egypt',
    language: 'Arabic',
    category: 'Life',
  },
];

export async function getRiddles(): Promise<Riddle[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(riddles);
}

export async function getRiddleById(id: string): Promise<Riddle | undefined> {
  return Promise.resolve(riddles.find(r => r.id === id));
}

export async function getOrigins(): Promise<string[]> {
  const origins = new Set(riddles.map(r => r.origin).filter(Boolean) as string[]);
  return Promise.resolve(Array.from(origins).sort());
}

export async function getLanguages(): Promise<string[]> {
  const languages = new Set(riddles.map(r => r.language).filter(Boolean) as string[]);
  return Promise.resolve(Array.from(languages).sort());
}
