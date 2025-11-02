'use client';

import { useState } from 'react';
import type { Riddle } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';

export function RiddleCard({ riddle }: { riddle: Riddle }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000">
      <Card
        className={cn(
          'relative h-64 w-full cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 flex h-full w-full flex-col justify-between p-6 [backface-visibility:hidden]">
          <CardHeader className="p-0">
            <p className="font-headline text-lg">{riddle.question}</p>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2 p-0">
             <div className="flex flex-wrap gap-2">
              {riddle.origin && <Badge variant="secondary">{riddle.origin}</Badge>}
              {riddle.language && <Badge variant="secondary">{riddle.language}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">Tap to reveal answer</p>
          </CardFooter>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 h-full w-full rounded-lg bg-accent p-6 text-accent-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="text-sm font-bold uppercase tracking-widest">Answer</p>
                <p className="mt-2 font-headline text-3xl font-bold">{riddle.answer}</p>
                 <Button variant="ghost" size="sm" className="absolute bottom-4 text-accent-foreground/70 hover:text-accent-foreground">
                    <RotateCw className="mr-2 size-4" /> Tap to flip back
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
}
