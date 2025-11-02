'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Riddle } from '@/lib/types';
import { getAdaptiveRiddle } from '@/actions/riddle';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ShareButton } from '@/components/ShareButton';

function uuidv4() {
  // @ts-ignore
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

type GameState = 'start' | 'playing' | 'revealed' | 'error';

export default function PlayPage() {
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [isPending, startTransition] = useTransition();
  const [pastRiddleIds, setPastRiddleIds] = useLocalStorage<string[]>('pastRiddleIds', []);
  const [userId] = useLocalStorage('devinetteNetUserId', uuidv4);
  const [userGuess, setUserGuess] = useState('');

  const fetchNextRiddle = () => {
    startTransition(async () => {
      try {
        const nextRiddle = await getAdaptiveRiddle(userId, pastRiddleIds);
        if (nextRiddle) {
          setRiddle(nextRiddle);
          setGameState('playing');
          setUserGuess('');
        } else {
          setGameState('error');
        }
      } catch (error) {
        console.error(error);
        setGameState('error');
      }
    });
  };

  useEffect(() => {
    // Fetch initial riddle
     startTransition(async () => {
      try {
        const nextRiddle = await getAdaptiveRiddle(userId, pastRiddleIds);
        if (nextRiddle) {
          setRiddle(nextRiddle);
          setGameState('start'); // Start at the beginning screen
        } else {
          setGameState('error');
        }
      } catch (error) {
        console.error(error);
        setGameState('error');
      }
    });
  }, [userId]); // Only on initial load and if userId changes

  const handleShowAnswer = () => {
    setGameState('revealed');
    if (riddle && !pastRiddleIds.includes(riddle.id)) {
      setPastRiddleIds([...pastRiddleIds, riddle.id]);
    }
  };

  const handleNextRiddle = () => {
    fetchNextRiddle();
  };
  
  const handleStart = () => {
    setGameState('playing');
  }

  const renderContent = () => {
    if (isPending && !riddle) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="font-headline text-xl text-foreground/80">
            Finding the perfect riddle for you...
          </p>
        </div>
      );
    }

    if (gameState === 'error') {
      return (
        <div className="text-center">
          <CardTitle>Oops!</CardTitle>
          <CardDescription>
            We couldn't fetch a riddle. Please try again.
          </CardDescription>
          <Button onClick={fetchNextRiddle} className="mt-4">
            <RotateCcw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      );
    }
    
    if (!riddle) return null;

    if (gameState === 'start') {
        return (
            <div className="text-center">
                <h1 className="font-headline text-6xl font-bold text-primary">Devinette!</h1>
                <p className="mt-2 text-xl text-muted-foreground">Are you ready?</p>
                <Button onClick={handleStart} size="lg" className="mt-8 animate-pulse">
                    Net!
                    <ArrowRight className="ml-2 size-5" />
                </Button>
            </div>
        )
    }

    return (
      <>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl">
            {riddle.question}
          </CardTitle>
          <div className="flex justify-center gap-2 pt-4">
            {riddle.origin && <Badge variant="secondary">{riddle.origin}</Badge>}
            {riddle.language && <Badge variant="secondary">{riddle.language}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col items-center justify-center gap-6">
          {gameState === 'playing' && (
            <div className="w-full max-w-sm space-y-4">
              <Input
                type="text"
                placeholder="What's your answer?"
                className="text-center text-lg"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
              />
              <Button onClick={handleShowAnswer} className="w-full">
                <Lightbulb className="mr-2 size-4" /> Show Answer
              </Button>
            </div>
          )}
          {gameState === 'revealed' && (
            <div className="flex flex-col items-center gap-4 rounded-lg bg-accent/10 p-6 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Answer
              </p>
              <p className="font-headline text-4xl font-bold text-accent">
                {riddle.answer}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4 sm:flex-row sm:justify-between">
            <ShareButton title="Check out this riddle!" text={`Riddle: ${riddle.question}\n\nCan you guess it?`} />
            {gameState === 'revealed' && (
              <Button onClick={handleNextRiddle} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 size-4" />
                )}
                Next Riddle
              </Button>
            )}
        </CardFooter>
      </>
    );
  };

  return (
    <div className="container mx-auto flex max-w-4xl flex-grow items-center justify-center p-4 py-12">
      <Card className="flex w-full min-h-[50vh] flex-col shadow-2xl">
        {renderContent()}
      </Card>
    </div>
  );
}
