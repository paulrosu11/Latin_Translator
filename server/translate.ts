import { OpenAI } from 'openai';
import * as fs from 'fs';
const filterPrompt = fs.readFileSync('server/FinalFilterPrompt.txt', 'utf-8');
const RevisionPrompt = fs.readFileSync('server/GPT4Prompt.txt', 'utf-8');
const FineTunedPrompt = fs.readFileSync('server/FineTunedSystemPrompt.txt', 'utf-8');
const clientGPT = new OpenAI({ apiKey: "replace with your api key" });

export async function translate_latin_openai(text: string): Promise<string> {
  const translationPromises = Array.from({ length: 5 }, () => translateAndRevise(text));
  
  // Wait for all translations and revisions to complete
  const translations = await Promise.all(translationPromises);

  // Prepare the comparison prompt for GPT-4 to include 5 translations
  const comparisonPrompt = `Given these five translations, select the best one based on this Latin provided text: \n ${text} \n1. ${translations[0]}\n2. ${translations[1]}\n3. ${translations[2]}\n4. ${translations[3]}\n5. ${translations[4]}`;

  // Make the comparison call to GPT-4
  const bestChoiceResponse = await clientGPT.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content: filterPrompt       },
      {
        role: "user",
        content: comparisonPrompt  }
    ]
  });

  // Output the best translation as per GPT-4
  const finalRevisedResponse = await clientGPT.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content: RevisionPrompt       },
      {
        role: "user",
        content: `Return a corrected translation or the same if it is accurate: \n Latin text: ${text} \n translation: \n ${bestChoiceResponse.choices[0].message.content}`
      }
    ]
  });

  // Return the final revised response
  return finalRevisedResponse.choices[0].message.content;
}

async function translateAndRevise(text: string): Promise<string> {
  // Initial translation
  const initialResponse = await clientGPT.chat.completions.create({
    model: "Replace with your fine tuned model name, should look like ft:gpt-3.5-turbo-0125:...",
    messages: [
      {
        role: "system",
        content: FineTunedPrompt
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.68,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const translated_text = initialResponse.choices[0].message.content;

  // Revision
  const revisedResponse = await clientGPT.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: RevisionPrompt
      },
      {
        role: "user",
        content: `Return a corrected translation or the same if it is accurate:\nLatin text: ${text}\nTranslation:\n${translated_text}`
      }
    ]
  });

  return revisedResponse.choices[0].message.content;
}
