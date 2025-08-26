"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

const models = [
  {
    name: "GPT-4o",
    value: "gpt-4o",
  },
  {
    name: "GPT-5 mini",
    value: "gpt-5-mini",
  },
];

const Chat = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status } = useChat() as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
          },
        },
      );
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 relative size-full">
      <div className="flex flex-col h-full gap-2">
        <Conversation className="h-full text-sm">
          <ConversationContent className="space-y-1">
            {messages.map((message: any) => (
              <div key={message.id} className="mb-1">
                <Message
                  from={message.role}
                  key={message.id}
                  className="py-1 px-2 rounded-md"
                >
                  <MessageContent className="text-sm leading-tight">
                    {message.parts.map((part: any, i: number) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response
                              key={`${message.id}-${i}`}
                              className="text-sm whitespace-pre-wrap"
                            >
                              {part.text}
                            </Response>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full text-sm"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent className="text-sm">
                                {part.text}
                              </ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect
                onValueChange={(value: string) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((m) => (
                    <PromptInputModelSelectItem key={m.value} value={m.value}>
                      {m.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default Chat;
