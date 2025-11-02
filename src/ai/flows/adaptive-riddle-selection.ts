'use server';

/**
 * @fileOverview An adaptive riddle selection AI agent.
 *
 * - adaptiveRiddleSelection - A function that handles the adaptive riddle selection process.
 * - AdaptiveRiddleSelectionInput - The input type for the adaptiveRiddleSelection function.
 * - AdaptiveRiddleSelectionOutput - The return type for the adaptiveRiddleSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveRiddleSelectionInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  availableRiddleIds: z
    .array(z.string())
    .describe('The list of available riddle IDs to choose from.'),
  pastRiddleIds: z
    .array(z.string())
    .optional()
    .describe('The list of riddle IDs the user has seen in the past.'),
  userOrigin: z
    .string()
    .optional()
    .describe('The user country of origin to prioritize riddles.'),
});
export type AdaptiveRiddleSelectionInput = z.infer<typeof AdaptiveRiddleSelectionInputSchema>;

const AdaptiveRiddleSelectionOutputSchema = z.object({
  selectedRiddleId: z.string().describe('The ID of the selected riddle.'),
  reason: z.string().describe('The reason for selecting this riddle.'),
});
export type AdaptiveRiddleSelectionOutput = z.infer<typeof AdaptiveRiddleSelectionOutputSchema>;

export async function adaptiveRiddleSelection(input: AdaptiveRiddleSelectionInput): Promise<AdaptiveRiddleSelectionOutput> {
  return adaptiveRiddleSelectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveRiddleSelectionPrompt',
  input: {schema: AdaptiveRiddleSelectionInputSchema},
  output: {schema: AdaptiveRiddleSelectionOutputSchema},
  prompt: `You are an expert in selecting riddles for users in a personalized and engaging way.

Given the following information about the user and available riddles, select the most suitable riddle ID for the user.

User ID: {{{userId}}}
Available Riddle IDs: {{availableRiddleIds}}
Past Riddle IDs: {{#if pastRiddleIds}}{{{pastRiddleIds}}}{{else}}None{{/if}}
User Origin: {{#if userOrigin}}{{{userOrigin}}}{{else}}Unknown{{/if}}

Consider the following factors when selecting a riddle:

*   Prioritize riddles the user has not seen before.
*   If the user has a specified origin, prioritize riddles from that origin to increase engagement.
*   Ensure a variety of riddle origins to keep the quiz fresh.

Respond with the selected riddle ID and a brief reason for your choice.

Output format: { \"selectedRiddleId\": \"riddleId\", \"reason\": \"reason\" }`,
});

const adaptiveRiddleSelectionFlow = ai.defineFlow(
  {
    name: 'adaptiveRiddleSelectionFlow',
    inputSchema: AdaptiveRiddleSelectionInputSchema,
    outputSchema: AdaptiveRiddleSelectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
