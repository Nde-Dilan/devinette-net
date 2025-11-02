'use server';

/**
 * @fileOverview A flow for generating riddles using an AI model.
 *
 * - generateRiddles - A function that generates a specified number of riddles.
 * - GenerateRiddlesInput - The input type for the generateRiddles function.
 * - GenerateRiddlesOutput - The return type for the generateRiddles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Riddle } from '@/lib/types';

const GenerateRiddlesInputSchema = z.object({
  count: z.number().describe('The number of riddles to generate.'),
});
export type GenerateRiddlesInput = z.infer<typeof GenerateRiddlesInputSchema>;

// We don't know the exact structure from the model, so we'll be more flexible here.
const RiddleSchema = z.object({
  question: z.string(),
  answer: z.string(),
  origin: z.string().optional(),
  language: z.string().optional(),
});

const GenerateRiddlesOutputSchema = z.object({
  riddles: z.array(RiddleSchema),
});
export type GenerateRiddlesOutput = z.infer<typeof GenerateRiddlesOutputSchema>;

export async function generateRiddles(input: GenerateRiddlesInput): Promise<GenerateRiddlesOutput> {
  return generateRiddlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiddlesPrompt',
  input: { schema: GenerateRiddlesInputSchema },
  output: { schema: GenerateRiddlesOutputSchema },
  prompt: `You are a cultural expert specializing in African folklore and traditions.
Generate {{{count}}} unique riddles from various African countries.
Ensure a diverse representation of countries and cultures.
For each riddle, provide a question, a concise answer, the country of origin, and the primary language it's told in.
Do not repeat riddles.

Your output must be a valid JSON object following this structure:
{
  "riddles": [
    {
      "question": "The riddle's question.",
      "answer": "The riddle's answer.",
      "origin": "Country Name",
      "language": "Language Name"
    }
  ]
}`,
});

const generateRiddlesFlow = ai.defineFlow(
  {
    name: 'generateRiddlesFlow',
    inputSchema: GenerateRiddlesInputSchema,
    outputSchema: GenerateRiddlesOutputSchema,
  },
  async (input) => {
    // Gemini may not return the exact number of riddles requested, so we may need to adjust.
    const { output } = await prompt(input);
    return output || { riddles: [] };
  }
);
