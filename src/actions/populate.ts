'use server';

import { generateRiddles } from '@/ai/flows/generate-riddles-flow';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initializeFirebase } from '@/firebase/server';
import type { Riddle } from '@/lib/types';
import { collection } from 'firebase/firestore';

export async function populateRiddleBatch(batchSize: number): Promise<{
  success: boolean;
  message: string;
  riddlesAdded: number;
}> {
  const { firestore } = initializeFirebase();
  const riddlesCol = collection(firestore, 'riddles');
  let riddlesAdded = 0;

  try {
    console.log(`Generating a batch of ${batchSize} riddles...`);

    const result = await generateRiddles({ count: batchSize });

    if (result && result.riddles.length > 0) {
      for (const riddle of result.riddles) {
        const newRiddle: Omit<Riddle, 'id'> = {
          ...riddle,
          status: 'validated',
        };
        // This is a non-blocking write.
        addDocumentNonBlocking(riddlesCol, newRiddle);
        riddlesAdded++;
      }

      const message = `Successfully added batch of ${riddlesAdded} riddles.`;
      console.log(message);
      return {
        success: true,
        message,
        riddlesAdded,
      };
    } else {
      throw new Error('AI returned no riddles.');
    }
  } catch (error: any) {
    console.error(`Error during batch population:`, error);
    const message = `An error occurred while generating a batch: ${error.message || 'Unknown error'}.`;
    return {
      success: false,
      message,
      riddlesAdded: 0,
    };
  }
}
