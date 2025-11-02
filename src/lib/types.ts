export type Riddle = {
  id: string;
  question: string;
  answer: string;
  origin?: string;
  language?: string;
  category?: string;
  status?: 'pending' | 'validated';
};
