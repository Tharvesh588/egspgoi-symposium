
'use server';
/**
 * @fileOverview A chatbot flow for assisting users with registration and symposium questions.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { readDb } from '@/lib/database';
import { z } from 'zod';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chat(input: ChatInput): Promise<ChatOutput> {
  return registrationChatFlow(input);
}


const registrationChatFlow = ai.defineFlow(
  {
    name: 'registrationChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const db = await readDb();
    const context = `
      Events: ${JSON.stringify(db.events.map(e => ({name: e.name, description: e.description, date: e.date, fee: e.registrationFee, mode: e.mode, category: e.category, department: e.department.name, departmentId: e.department.id, departmentHeadEmail: e.department.head?.email})), null, 2)}
      Departments: ${JSON.stringify(db.departments.map(d => ({id: d.id, name: d.name})), null, 2)}
      Contact Number: "+1-800-555-1234"
    `;

    const prompt = `You are a friendly and professional chatbot assistant for the Symposium Central event registration platform. Your role is to guide users through a step-by-step registration process by providing a clear set of options. Do not answer free-form questions; always guide the user with choices.

Your goal is to help a user register for an event by asking a series of questions. Based on the user's selection, you will "store" their choices (mode, department, event) to guide the conversation. Provide a concise response and then present the next logical set of options. ALWAYS end your response with a new list of suggestions.

Format your suggestions as a Markdown list of links with a special "suggestion:" protocol. For example:
- [Online Events](suggestion:Register for Online Events)
- [Offline Events](suggestion:Register for Offline Events)

**Registration Flow:**

1.  **Start:** When the user wants to register (e.g., selects "Register for an Event"), ask them to choose between "Online" and "Offline" event modes.
2.  **Ask for Department:** After they choose a mode, present a list of all departments that have events in that mode.
3.  **Ask for Event:** Once they select a department, show them a list of all available events for that department and mode.
4.  **Confirm and Email:** When they select an event, confirm their choice (e.g., "Great! You are now registered for Hackathon 2024.") and state that a confirmation email will be sent to the department head.
5.  **Ask About Non-Technical:** After the first registration, ask them if they are also interested in non-technical events.
6.  **Non-Technical Flow (if yes):** If they say yes, repeat the process: ask for a department, then show available non-technical events in that department. After selection, confirm again.
7.  **Final Summary:** After they've finished, or if they decline non-technical events, you MUST provide a summary of the event they registered for. The summary should include the event name, the department, and the department head's email for their reference. After providing the summary, end the conversation in a polite and helpful tone, with no further options. For example: "Thank you for registering! We look forward to seeing you at the event. If you have any more questions, feel free to start a new conversation. Have a great day!"

**General Rules:**
- When the user starts with "Hello", greet them warmly and provide initial options like "Register for an Event" and "What events are there?".
- If a question is outside the scope of the symposium, politely state that and provide the main menu of options again.
- If you cannot answer a question based on the context, provide the contact number and then present the main menu of options.
- The final summary is the last step. Do not present any more options after the summary.

Context:
${context}

User's selected option: "${input.message}"

Your response (remember to follow the registration flow and end with a list of new options, unless it's the final summary):
    `;
    
    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
    });

    return {
      response: llmResponse.text,
    };
  }
);
