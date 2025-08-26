import { prompt } from "@/lib/ai/prompts";
import tools from "@/lib/ai/tools";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  smoothStream,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: openai(model),
    messages: convertToModelMessages(messages),
    system: prompt,
    experimental_transform: smoothStream(),
    tools,
    stopWhen: stepCountIs(50),
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
