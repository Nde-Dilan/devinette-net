'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Puzzle, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/play', label: 'Play', icon: Puzzle },
  { href: '/explore', label: 'Explore', icon: List },
  { href: '/submit', label: 'Submit', icon: Plus },
];

export function Header() {
  const pathname = usePathname();

  const NavLink = ({
    href,
    label,
    icon: Icon,
    className,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    className?: string;
  }) => (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        pathname === href
          ? 'bg-accent text-accent-foreground'
          : 'text-foreground/80',
        className
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-2xl" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                <Logo className="mb-8 text-3xl" />
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      className="text-lg"
                    />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
