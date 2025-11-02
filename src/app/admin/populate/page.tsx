'use client';

import { useState, useTransition } from 'react';
import { populateRiddlesInFirestore } from '@/actions/populate';
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
import { ScrollArea } from '@/components/ui/scroll-area';

type Status = 'idle' | 'running' | 'success' | 'error';
const TOTAL_RIDDLES = 100;

export default function PopulatePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [finalMessage, setFinalMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handlePopulate = () => {
    setStatus('running');
    setFinalMessage('');
    setProgress(0);

    startTransition(async () => {
      const result = await populateRiddlesInFirestore();
      setProgress((result.riddlesAdded / TOTAL_RIDDLES) * 100);
      setFinalMessage(result.message);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    });
  };

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
            Click the button to populate Firestore with {TOTAL_RIDDLES} validated
            riddles from various African countries using AI. This may take a
            few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Button
              onClick={handlePopulate}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? 'Processing...' : 'Start Population'}
            </Button>
          </div>

          {status !== 'idle' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={isPending ? 50 : progress} className={cn(isPending && "animate-pulse")} />
                <span className="text-sm font-semibold">{isPending ? '?' : Math.round(progress)}%</span>
              </div>
              
              {(status === 'success' || status === 'error') && (
                 <div className="rounded-md border bg-muted p-4 text-center">
                    <p className={cn(
                        "font-medium",
                        status === 'success' && 'text-green-600',
                        status === 'error' && 'text-red-600'
                    )}>
                        {finalMessage}
                    </p>
                 </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
