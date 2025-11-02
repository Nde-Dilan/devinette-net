import { SubmitRiddleForm } from '@/components/SubmitRiddleForm';
import { AfricanPattern } from '@/components/AfricanPattern';

export default function SubmitPage() {
  return (
    <div className="relative min-h-full w-full bg-background">
      <div className="absolute inset-0 z-0 opacity-50">
        <AfricanPattern />
      </div>
      <div className="container relative mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 w-full text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Submit a Riddle
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Share a piece of your culture. Help our collection grow!
          </p>
        </div>
        <SubmitRiddleForm />
      </div>
    </div>
  );
}
