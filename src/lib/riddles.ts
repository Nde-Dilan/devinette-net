'use client';
import {
  collection,
  getDoc,
  doc,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Riddle } from './types';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// NOTE: This file is for client-side Firebase access.
// Server-side fetching functions are in riddles.server.ts

/**
 * Fetches a single riddle by its ID from the 'riddles' collection.
 * This function is intended for client-side use. The security rules will ensure
 * that only riddles with status 'validated' can be fetched.
 * @param id The ID of the riddle to fetch.
 * @returns A promise that resolves to the Riddle object or undefined if not found or not validated.
 */
export async function getRiddleById(id: string): Promise<Riddle | undefined> {
  const { firestore } = initializeFirebase();
  const riddleDocRef = doc(firestore, 'riddles', id);
  const riddleDoc = await getDoc(riddleDocRef);
  if (riddleDoc.exists() && riddleDoc.data().status === 'validated') {
    return { ...riddleDoc.data(), id: riddleDoc.id } as Riddle;
  }
  return undefined;
}

/**
 * Submits a new riddle to the 'riddles' collection with a 'pending' status.
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

  const riddlesCol = collection(firestore, 'riddles');
  const newRiddle: Omit<Riddle, 'id'> = {
    ...riddleData,
    status: 'pending', // New submissions are always pending
  };

  // Use the non-blocking add function. It handles errors via the global emitter.
  addDocumentNonBlocking(riddlesCol, newRiddle);
}
