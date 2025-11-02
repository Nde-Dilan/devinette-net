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

export default function PopulatePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handlePopulate = () => {
    setStatus('running');
    setLogs(['Initiating process...']);
    setProgress(0);

    startTransition(async () => {
      const result = await populateRiddlesInFirestore(async (prog, msg) => {
        setProgress(prog);
        setLogs((prev) => [...prev, msg]);
      });

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
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold">
            <StatusIcon />
            Database Riddle Population
          </CardTitle>
          <CardDescription>
            Click the button to populate Firestore with 100 validated riddles from various African countries using AI.
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
                <Progress value={progress} className="w-full" />
                <span className="text-sm font-semibold">{Math.round(progress)}%</span>
              </div>
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <div className="flex flex-col gap-2 text-sm">
                    {logs.map((log, index) => (
                        <p key={index}>{log}</p>
                    ))}
                </div>
              </ScrollArea>
              {status === 'success' && <p className="text-center font-medium text-green-600">Population successful!</p>}
              {status === 'error' && <p className="text-center font-medium text-red-600">Population encountered an error. Check logs.</p>}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
