import OpenAI from "openai";

let openai: OpenAI;

export function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });
  }

  return openai;
}

interface ExtractContentResult {
  title: string;
  summary: string;
}

export async function generateExtractContent(
  extract: string
): Promise<ExtractContentResult> {
  const openAI = getOpenAI();

  const SYSTEM_MESSAGE =
    'You are a helpful assistant that summarizes the content of a webpage and returns a title and a brief summary about the content. Provide your response as a JSON object with the following schema: { title: "", summary: "" }';

  const chatCompletion = await openAI.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_MESSAGE },
      { role: "user", content: extract },
    ],
    model: "gpt-3.5-turbo",
  });

  const [message] = chatCompletion.choices;
  const content = JSON.parse(message.message.content ?? "{}");
  return content as ExtractContentResult;
}
