'use client';

import { useState, useTransition, useEffect } from 'react';
import { populateRiddleBatch } from '@/actions/populate';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Rocket, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'running' | 'success' | 'error';
const TOTAL_RIDDLES = 100;
const BATCH_SIZE = 10;

export default function PopulatePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [lastMessage, setLastMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [riddlesCount, setRiddlesCount] = useLocalStorage('populatedRiddlesCount', 0);
  const { toast } = useToast();

  const progress = (riddlesCount / TOTAL_RIDDLES) * 100;

  const handlePopulate = () => {
    if (riddlesCount >= TOTAL_RIDDLES) {
       toast({ title: "Database is already populated.", description: `You have ${riddlesCount} riddles.`});
       setStatus('success');
       setLastMessage(`Population already complete with ${riddlesCount} riddles.`);
       return;
    }

    setStatus('running');
    setLastMessage('Starting population...');

    startTransition(() => {
      runPopulationLoop();
    });
  };

  const runPopulationLoop = async () => {
     let currentCount = riddlesCount;
     while (currentCount < TOTAL_RIDDLES) {
        setLastMessage(`Requesting a batch... Current count: ${currentCount}`);
        const result = await populateRiddleBatch(BATCH_SIZE);

        if (result.success) {
            const newCount = currentCount + result.riddlesAdded;
            setRiddlesCount(newCount);
            currentCount = newCount;
            setLastMessage(`Added ${result.riddlesAdded} riddles. Total: ${newCount}`);
        } else {
            setStatus('error');
            setLastMessage(`Error: ${result.message}. Pausing population.`);
            toast({
                variant: 'destructive',
                title: 'Population Error',
                description: result.message
            });
            return; // Stop the loop on error
        }

        // Small delay to allow UI to update and avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
     }

     if(currentCount >= TOTAL_RIDDLES) {
        setStatus('success');
        setLastMessage(`Population complete! Total riddles: ${currentCount}.`);
        toast({ title: "Population Complete!", description: `Successfully added ${currentCount} riddles.`});
     }
  };
  
  const handleReset = () => {
    setRiddlesCount(0);
    setStatus('idle');
    setLastMessage('');
    toast({title: "Progress Reset", description: "You can now start the population from the beginning."})
  }


  const StatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="mr-2 size-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="mr-2 size-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="mr-2 size-5 text-red-500" />;
      default:
        return <Rocket className="mr-2 size-5" />;
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold">
            <StatusIcon />
            Database Riddle Population
          </CardTitle>
          <CardDescription>
            Populate Firestore with {TOTAL_RIDDLES} riddles. Progress is saved,
            so you can resume anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handlePopulate}
              disabled={isPending || riddlesCount >= TOTAL_RIDDLES}
              className="w-full"
              size="lg"
            >
              {isPending ? 'Processing...' : (riddlesCount > 0 && riddlesCount < TOTAL_RIDDLES ? `Resume (${riddlesCount}/${TOTAL_RIDDLES})` : 'Start Population')}
            </Button>
            <Button
              onClick={handleReset}
              disabled={isPending}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Reset Progress
            </Button>
          </div>

          {status !== 'idle' || riddlesCount > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={progress} />
                <span className="text-sm font-semibold">{Math.round(progress)}%</span>
              </div>
              
              <div className="rounded-md border bg-muted p-4 text-center min-h-[60px] flex items-center justify-center">
                 <p className={cn(
                     "font-medium text-sm",
                     status === 'success' && 'text-green-600',
                     status === 'error' && 'text-red-600',
                     status === 'running' && 'text-blue-600'
                 )}>
                     {isPending ? lastMessage : (lastMessage || `Ready to begin. ${riddlesCount} riddles already populated.`)}
                 </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
