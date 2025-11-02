import 'server-only';
import { collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server';
import type { Riddle } from './types';

/**
 * Fetches all validated riddles from the 'riddles' collection in Firestore.
 * This is a server-side function.
 * @returns A promise that resolves to an array of Riddle objects.
 */
export async function getRiddles(): Promise<Riddle[]> {
  const { firestore } = initializeFirebase();
  const riddlesCol = collection(firestore, 'riddles');
  const snapshot = await getDocs(riddlesCol);
  return snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Riddle)
  );
}

/**
 * Fetches all unique origins from the validated riddles.
 * This is a server-side function.
 * @returns A promise that resolves to a sorted array of unique origin strings.
 */
export async function getOrigins(): Promise<string[]> {
  const allRiddles = await getRiddles();
  const origins = new Set(
    allRiddles.map((r) => r.origin).filter(Boolean) as string[]
  );
  return Array.from(origins).sort();
}

/**
 * Fetches all unique languages from the validated riddles.
 * This is a server-side function.
 * @returns A promise that resolves to a sorted array of unique language strings.
 */
export async function getLanguages(): Promise<string[]> {
  const allRiddles = await getRiddles();
  const languages = new Set(
    allRiddles.map((r) => r.language).filter(Boolean) as string[]
  );
  return Array.from(languages).sort();
}
