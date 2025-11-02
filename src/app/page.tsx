import Link from 'next/link';
import { ArrowRight, List, Plus, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { AfricanPattern } from '@/components/AfricanPattern';

const menuOptions = [
  {
    title: 'Play a Riddle',
    description: 'Challenge yourself with a random riddle.',
    href: '/play',
    icon: <Puzzle className="size-8 text-primary" />,
  },
  {
    title: 'Explore Riddles',
    description: 'Browse our collection of riddles.',
    href: '/explore',
    icon: <List className="size-8 text-primary" />,
  },
  {
    title: 'Submit a Riddle',
    description: 'Contribute to our growing library.',
    href: '/submit',
    icon: <Plus className="size-8 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 z-0">
        <AfricanPattern />
      </div>
      <main className="z-10 flex flex-col items-center justify-center space-y-12">
        <div className="text-center">
          <Logo className="text-6xl md:text-8xl" />
          <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
            A playful and cultural quiz-style app inspired by African riddles.
            Ready for the challenge?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {menuOptions.map((option) => (
            <Card
              key={option.title}
              className="group transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
            >
              <Link href={option.href} className="block h-full">
                <CardHeader className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4">{option.icon}</div>
                    <CardTitle className="font-headline text-2xl">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {option.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 justify-start p-0 text-primary group-hover:underline"
                  >
                    Start Now <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </main>
      <footer className="absolute bottom-4 z-10 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} DevinetteNet. All rights reserved.</p>
      </footer>
    </div>
  );
}
