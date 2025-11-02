'use server';

import { generateRiddles } from '@/ai/flows/generate-riddles-flow';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initializeFirebase } from '@/firebase/server';
import type { Riddle } from '@/lib/types';
import { collection } from 'firebase/firestore';

const BATCH_SIZE = 10;
const TOTAL_RIDDLES = 100;

export async function populateRiddlesInFirestore(): Promise<{
  success: boolean;
  message: string;
  riddlesAdded: number;
}> {
  const { firestore } = initializeFirebase();
  const riddlesCol = collection(firestore, 'riddles');
  let riddlesAdded = 0;
  let attempts = 0;
  const maxAttempts = 20; // Prevent infinite loops

  console.log('Starting riddle generation...');

  while (riddlesAdded < TOTAL_RIDDLES && attempts < maxAttempts) {
    attempts++;
    try {
      const remaining = TOTAL_RIDDLES - riddlesAdded;
      const needed = Math.min(BATCH_SIZE, remaining);

      console.log(
        `Generating a batch of ${needed} riddles... (Attempt ${attempts})`
      );

      const result = await generateRiddles({ count: needed });

      if (result && result.riddles.length > 0) {
        const batchToAdd = result.riddles.slice(0, needed); // Ensure we don't add more than needed

        for (const riddle of batchToAdd) {
          const newRiddle: Omit<Riddle, 'id'> = {
            ...riddle,
            status: 'validated',
          };
          addDocumentNonBlocking(riddlesCol, newRiddle);
          riddlesAdded++;
        }

        console.log(
          `Successfully added ${batchToAdd.length} new riddles. Total: ${riddlesAdded}/${TOTAL_RIDDLES}`
        );
      } else {
        console.log(
          `AI returned no riddles on attempt ${attempts}. Retrying...`
        );
      }
    } catch (error: any) {
      console.error(`Error during population (Attempt ${attempts}):`, error);
      // If one batch fails, we'll stop and report the error.
      const message = `An error occurred while generating riddles: ${error.message || 'Unknown error'}. So far, ${riddlesAdded} riddles have been added.`;
      return {
        success: false,
        message,
        riddlesAdded,
      };
    }
    // Small delay between batches to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (riddlesAdded >= TOTAL_RIDDLES) {
    const message = `Population complete! Added ${riddlesAdded} riddles.`;
    console.log(message);
    return {
      success: true,
      message,
      riddlesAdded,
    };
  } else {
    const message = `Population finished after ${attempts} attempts, but only added ${riddlesAdded} out of ${TOTAL_RIDDLES}. The AI may have run out of unique riddles.`;
    console.log(message);
    return {
      success: false,
      message,
      riddlesAdded,
    };
  }
}
