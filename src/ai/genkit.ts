import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "YOUR_API_KEY_HERE"})],
  model: 'googleai/gemini-2.5-flash',
});
