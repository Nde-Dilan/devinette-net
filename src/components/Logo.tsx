import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn('font-headline font-bold tracking-tighter', className)}
    >
      <span className="text-primary">Devinette</span>
      <span className="text-accent">Net</span>
    </div>
  );
}
