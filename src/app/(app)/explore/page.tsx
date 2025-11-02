import { getRiddles, getOrigins, getLanguages } from '@/lib/riddles.server';
import ExploreRiddles from '@/components/ExploreRiddles';
import { AfricanPattern } from '@/components/AfricanPattern';

export default async function ExplorePage() {
  const riddles = await getRiddles();
  const origins = await getOrigins();
  const languages = await getLanguages();

  return (
    <div className="relative min-h-full w-full bg-background">
       <div className="absolute inset-0 z-0 opacity-50">
        <AfricanPattern />
      </div>
      <div className="container relative mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            Explore Riddles
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse, filter, and discover riddles from across the continent.
          </p>
        </div>
        <ExploreRiddles
          initialRiddles={riddles}
          origins={origins}
          languages={languages}
        />
      </div>
    </div>
  );
}
