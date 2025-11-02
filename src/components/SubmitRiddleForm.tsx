'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { submitRiddle } from '@/lib/riddles';

const formSchema = z.object({
  question: z.string().min(10, 'Riddle must be at least 10 characters long.'),
  answer: z.string().min(1, 'Answer is required.'),
  origin: z.string().optional(),
  language: z.string().optional(),
});

export function SubmitRiddleForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
      origin: '',
      language: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        try {
            await submitRiddle(values);
            toast({
                title: 'Riddle Submitted!',
                description: "Thank you for your contribution. It's now pending review.",
            });
            form.reset();
        } catch (error: any) {
            console.error('Submission failed', error);
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: error.message || 'Could not submit your riddle. Please try again later.',
            });
        }
    });
  }

  return (
    <Card className="w-full shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 p-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Riddle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I have cities, but no houses..."
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Write the question for your riddle.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A map" {...field} disabled={isPending} />
                  </FormControl>
                  <FormDescription>
                    What is the correct answer?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cameroon" {...field} disabled={isPending} />
                    </FormControl>
                    <FormDescription>Country or region of origin.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English" {...field} disabled={isPending} />
                    </FormControl>
                    <FormDescription>Original language of the riddle.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Riddle
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
