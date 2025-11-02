'use server';

import { generateRiddles } from '@/ai/flows/generate-riddles-flow';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initializeFirebase } from '@/firebase/server';
import type { Riddle } from '@/lib/types';
import { collection } from 'firebase/firestore';

const BATCH_SIZE = 10;
const TOTAL_RIDDLES = 100;

export async function populateRiddlesInFirestore(
  onProgress: (progress: number, message: string) => Promise<void>
): Promise<{ success: boolean; message: string }> {
  const { firestore } = initializeFirebase();
  const riddlesCol = collection(firestore, 'riddles');
  let riddlesAdded = 0;
  let attempts = 0;
  const maxAttempts = 20; // Prevent infinite loops

  await onProgress(0, 'Starting riddle generation...');

  while (riddlesAdded < TOTAL_RIDDLES && attempts < maxAttempts) {
    attempts++;
    try {
      const remaining = TOTAL_RIDDLES - riddlesAdded;
      const needed = Math.min(BATCH_SIZE, remaining);

      await onProgress(
        (riddlesAdded / TOTAL_RIDDLES) * 100,
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
          // Using non-blocking write, but we don't need to wait here.
          addDocumentNonBlocking(riddlesCol, newRiddle);
          riddlesAdded++;
        }
        
        await onProgress(
          (riddlesAdded / TOTAL_RIDDLES) * 100,
          `Successfully added ${batchToAdd.length} new riddles. Total: ${riddlesAdded}/${TOTAL_RIDDLES}`
        );

      } else {
         await onProgress(
          (riddlesAdded / TOTAL_RIDDLES) * 100,
          `AI returned no riddles on attempt ${attempts}. Retrying...`
        );
      }
    } catch (error: any) {
      console.error(`Error during population (Attempt ${attempts}):`, error);
       await onProgress(
          (riddlesAdded / TOTAL_RIDDLES) * 100,
          `An error occurred: ${error.message}. Retrying...`
        );
    }
     // Small delay between batches to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  if (riddlesAdded >= TOTAL_RIDDLES) {
     await onProgress(100, `Population complete! Added ${riddlesAdded} riddles.`);
    return { success: true, message: `Successfully added ${riddlesAdded} riddles.` };
  } else {
     await onProgress(100, `Population finished early after ${attempts} attempts. Added ${riddlesAdded} riddles.`);
    return { success: false, message: `Failed to add all riddles. Added ${riddlesAdded} out of ${TOTAL_RIDDLES}.` };
  }
}
