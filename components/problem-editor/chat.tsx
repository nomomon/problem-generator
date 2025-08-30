"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
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
import React, { FC, useState } from "react";
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
  onCodeChange: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Chat: FC<ChatProps> = ({ code, onCodeChange }) => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status, addToolResult } = useChat({
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;

      // ---------- read_file ----------
      if (toolCall.toolName === "read_file") {
        addToolResult({
          tool: "read_file",
          toolCallId: toolCall.toolCallId,
          output:
            (code ?? "// Empty file") + "\n\n CONTINUE TO MAKE TOOL CALLS",
        });
      }

      // ---------- update_problem_code ----------
      if (toolCall.toolName === "update_problem_code") {
        const { old_code, new_code } = toolCall.input as {
          old_code: string;
          new_code: string;
        };

        if (
          typeof old_code === "string" &&
          typeof new_code === "string" &&
          typeof code === "string"
        ) {
          onCodeChange((oldCode) => {
            if (!oldCode) return oldCode;
            return oldCode.replace(old_code, new_code); // single replace
          });
          addToolResult({
            tool: "update_problem_code",
            toolCallId: toolCall.toolCallId,
            output: "SUCCESS: Code block replaced successfully",
          });
        } else {
          addToolResult({
            tool: "update_problem_code",
            toolCallId: toolCall.toolCallId,
            output: "ERROR: Invalid parameters or code is undefined",
          });
        }
      }

      // ---------- patch_code ----------
      if (toolCall.toolName === "patch_code") {
        const { target, replacement, mode } = toolCall.input as {
          target: string;
          replacement: string;
          mode: "before" | "after" | "replace";
        };

        if (
          typeof target === "string" &&
          typeof replacement === "string" &&
          typeof mode === "string" &&
          typeof code === "string"
        ) {
          onCodeChange((oldCode) => {
            if (!oldCode) return oldCode;

            switch (mode) {
              case "before":
                return oldCode.replace(target, replacement + "\n" + target);
              case "after":
                return oldCode.replace(target, target + "\n" + replacement);
              case "replace":
                return oldCode.replace(target, replacement);
              default:
                return oldCode;
            }
          });

          addToolResult({
            tool: "patch_code",
            toolCallId: toolCall.toolCallId,
            output: `SUCCESS: Applied ${mode} patch around target "${target}"`,
          });
        } else {
          addToolResult({
            tool: "patch_code",
            toolCallId: toolCall.toolCallId,
            output: "ERROR: Invalid parameters or code is undefined",
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
                        case "tool-update_problem_code":
                        case "tool-patch_code":
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
