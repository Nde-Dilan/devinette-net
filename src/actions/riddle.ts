'use server';

import { adaptiveRiddleSelection } from '@/ai/flows/adaptive-riddle-selection';
import { getRiddles, getRiddleById } from '@/lib/riddles';
import type { Riddle } from '@/lib/types';

export async function getAdaptiveRiddle(
  userId: string,
  pastRiddleIds: string[]
): Promise<Riddle | null> {
  const allRiddles = await getRiddles();
  const availableRiddlesForSelection = allRiddles.filter(r => !pastRiddleIds.includes(r.id));

  if (availableRiddlesForSelection.length === 0) {
     // User has seen all riddles, maybe reset?
     pastRiddleIds = [];
  }

  const availableRiddleIds = allRiddles.map((r) => r.id);

  try {
    console.log('Requesting adaptive riddle for user:', userId);
    const result = await adaptiveRiddleSelection({
      userId,
      availableRiddleIds,
      pastRiddleIds,
      userOrigin: 'Cameroon', // Example origin, could be dynamic in a real app
    });

    console.log('AI selected riddle:', result.selectedRiddleId, 'Reason:', result.reason);

    const selectedRiddle = await getRiddleById(result.selectedRiddleId);
    
    // Ensure we don't return a riddle the user just saw if lists are out of sync
    if (selectedRiddle && pastRiddleIds.includes(selectedRiddle.id) && availableRiddlesForSelection.length > 0) {
       console.warn('AI selected a recently seen riddle. Falling back to random available.');
       const randomIndex = Math.floor(Math.random() * availableRiddlesForSelection.length);
       return availableRiddlesForSelection[randomIndex];
    }

    return selectedRiddle || null;
  } catch (error) {
    console.error('Error getting adaptive riddle, falling back to random:', error);
    // Fallback logic if AI fails
    const available = allRiddles.filter((r) => !pastRiddleIds.includes(r.id));
    if (available.length === 0) return (await getRiddles())[0]; // Or handle reset
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }
}
