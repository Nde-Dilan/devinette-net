'use client';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Riddle } from './types';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// NOTE: This file is now for client-side Firebase access.
// The static data has been moved to a migration script (or should be considered moved).

/**
 * Fetches all validated riddles from the 'riddles' collection in Firestore.
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
 * Fetches a single riddle by its ID from the 'riddles' collection.
 * @param id The ID of the riddle to fetch.
 * @returns A promise that resolves to the Riddle object or undefined if not found.
 */
export async function getRiddleById(id: string): Promise<Riddle | undefined> {
  const { firestore } = initializeFirebase();
  const riddleDoc = await getDoc(doc(firestore, 'riddles', id));
  if (riddleDoc.exists()) {
    return { ...riddleDoc.data(), id: riddleDoc.id } as Riddle;
  }
  return undefined;
}

/**
 * Fetches all unique origins from the validated riddles.
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
 * @returns A promise that resolves to a sorted array of unique language strings.
 */
export async function getLanguages(): Promise<string[]> {
  const allRiddles = await getRiddles();
  const languages = new Set(
    allRiddles.map((r) => r.language).filter(Boolean) as string[]
  );
  return Array.from(languages).sort();
}

/**
 * Submits a new riddle to the 'riddles_pending' collection for validation.
 * @param riddleData The partial riddle data from the submission form.
 */
export async function submitRiddle(
  riddleData: Omit<Riddle, 'id' | 'status'>
): Promise<void> {
  const { firestore, auth } = initializeFirebase();

  // Ensure user is authenticated (anonymously is fine)
  if (!auth.currentUser) {
    initiateAnonymousSignIn(auth);
    // You might want to wait for sign-in here, but for non-blocking UI, we proceed.
    // The security rules will enforce the auth requirement.
  }

  const pendingRiddlesCol = collection(firestore, 'riddles_pending');
  const newRiddle: Omit<Riddle, 'id'> = {
    ...riddleData,
    status: 'pending',
  };

  // Use the non-blocking add function. It handles errors via the global emitter.
  addDocumentNonBlocking(pendingRiddlesCol, newRiddle);
}
