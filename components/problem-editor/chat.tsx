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
import { FC, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

const models = [
  {
    name: "GPT-4.1",
    value: "gpt-4.1",
  },
  {
    name: "GPT-5 mini",
    value: "gpt-5-mini",
  },
];

interface ChatProps {
  code: string | undefined;
  onCodeChange: (code: string | undefined) => void;
}

const Chat: FC<ChatProps> = ({ code, onCodeChange }) => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status, addToolResult } = useChat({
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      if (toolCall.toolName == "read_file") {
        addToolResult({
          tool: "read_file",
          toolCallId: toolCall.toolCallId,
          output: code ?? "// Empty file",
        });
      }
      if (toolCall.toolName === "replace_string_in_file") {
        if (typeof toolCall.input === "object" && toolCall.input !== null) {
          const oldString = (toolCall.input as { old_string: string })
            .old_string;
          const newString = (toolCall.input as { new_string: string })
            .new_string;
          if (
            typeof oldString === "string" &&
            typeof newString === "string" &&
            typeof code === "string"
          ) {
            const updatedCode = code.split(oldString).join(newString);
            onCodeChange(updatedCode);
            addToolResult({
              tool: "replace_string_in_file",
              toolCallId: toolCall.toolCallId,
              output: updatedCode,
            });
          } else {
            addToolResult({
              tool: "replace_string_in_file",
              toolCallId: toolCall.toolCallId,
              output: "ERROR: Invalid parameters or code is undefined",
            });
          }
        } else {
          addToolResult({
            tool: "replace_string_in_file",
            toolCallId: toolCall.toolCallId,
            output: "ERROR: Invalid input structure",
          });
        }
      }
    },
  });

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
                        case "tool-read_file":
                        case "tool-replace_string_in_file":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="space-y-4"
                            >
                              <Tool>
                                <ToolHeader
                                  type={part.type}
                                  state={part.state}
                                />
                                <ToolContent>
                                  <ToolInput input={part.input} />
                                  <ToolOutput
                                    errorText={part.errorText}
                                    output={part.output}
                                  />
                                </ToolContent>
                              </Tool>
                            </div>
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
