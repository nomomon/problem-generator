"use client";

import { CodeEditor } from "@/components/problem-editor/code-editor";
import { CodeRunnerPanel } from "@/components/problem-editor/code-runner-panel";
import { PanelHeader } from "@/components/problem-editor/panel-header";
import {
  ProblemDetailsForm,
  ProblemDetails,
} from "@/components/problem-editor/problem-details-form";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import Chat from "./chat";
import { formatDifficulty } from "@/lib/utils";

interface ProblemEditorLayoutProps {
  code: string | undefined;
  onCodeChange: React.Dispatch<React.SetStateAction<string | undefined>>;
  details?: ProblemDetails;
  onDetailsChange?: (details: ProblemDetails) => void;
  defaultValue?: string;
  readOnly?: boolean;
  tailCode?: string;
  toolbar?: ReactNode;
  title?: string;
  subtitle?: string;
  status?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

const defaultCode = `
function generateProblem() {
    return {
        text: "Условие задачи",
        answerText: "Ответ на задачу",
        variables: {} // переменные задачи
    };
}
`.trim();

const defaultTailCode = `
const { text, answerText } = generateProblem();
return { text, answerText };`;

export function ProblemEditorLayout({
  code,
  onCodeChange,
  details,
  onDetailsChange,
  defaultValue = defaultCode,
  readOnly = false,
  tailCode = defaultTailCode,
  toolbar,
  title,
  subtitle,
  status,
  className = "h-full flex flex-col bg-background min-h-0",
}: ProblemEditorLayoutProps) {
  return (
    <div className={className}>
      {/* Header Section */}
      <div className="flex-shrink-0 border-b bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {title && (
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              {status && (
                <Badge variant={status.variant || "secondary"}>
                  {status.label}
                </Badge>
              )}
              {details?.difficulty && (
                <Badge
                  variant={
                    details.difficulty === "easy"
                      ? "default"
                      : details.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {formatDifficulty(details.difficulty)}
                </Badge>
              )}
              {/* Source display */}
              {(details?.sourceName || details?.sourceId) && (
                <div className="ml-3 text-sm text-muted-foreground">
                  {"Source: "}
                  {details?.sourceName
                    ? details.sourceName
                    : // If only id is present, just show 'Source #id'
                      `Source #${details.sourceId}`}
                  {details?.sourceEditionYear !== undefined &&
                  details?.sourceEditionYear !== null
                    ? ` (${details.sourceEditionYear})`
                    : details?.sourceName || details?.sourceId
                      ? " (Unknown year)"
                      : null}
                </div>
              )}
            </div>

            {/* Toolbar */}
            {toolbar && (
              <div className="flex items-center gap-2">{toolbar}</div>
            )}
          </div>

          {/* Topics Display */}
          {details?.topics && details.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {details.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0 p-3">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Details Panel */}
          {onDetailsChange && (
            <>
              <ResizablePanel
                defaultSize={25}
                minSize={20}
                maxSize={40}
                className="p-4 pr-0"
              >
                <Card className="gap-0 h-full border shadow-sm flex flex-col rounded-r-none  py-0">
                  <PanelHeader
                    title="Детали"
                    description="Настройте метаданные"
                  />
                  <div className="flex-1 min-h-0">
                    <ProblemDetailsForm
                      details={details || {}}
                      onDetailsChange={onDetailsChange}
                      className="h-full overflow-y-auto p-4"
                      noCard
                    />
                  </div>
                </Card>
              </ResizablePanel>
              <ResizableHandle withHandle className="w-0" />
            </>
          )}

          {/* Code Editor Panel */}
          <ResizablePanel
            defaultSize={onDetailsChange ? 37.5 : 50}
            minSize={30}
            className="p-4 px-0"
          >
            <Card className="gap-0 h-full border shadow-sm flex flex-col rounded-none py-0">
              <PanelHeader
                title="Редактор кода"
                description="Напишите вашу функцию на JavaScript"
              />
              <div className="flex-1 min-h-0">
                <CodeEditor
                  className="h-full"
                  value={code}
                  onChange={onCodeChange}
                  defaultValue={defaultValue}
                  size="full"
                  readOnly={readOnly}
                  variant="ghost"
                />
              </div>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          {/* Output Panel */}
          <ResizablePanel
            defaultSize={onDetailsChange ? 37.5 : 50}
            minSize={30}
            className="p-4 pl-0"
          >
            <Card className="gap-2 h-full border shadow-sm flex flex-col rounded-l-none py-0">
              <PanelHeader
                title="Вывод"
                description="Тестируйте и просматривайте результаты"
              />
              <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="vertical" className="h-full">
                  <ResizablePanel
                    defaultSize={40}
                    minSize={20}
                    className="p-4 px-0"
                  >
                    <div className="px-4 h-full min-h-0">
                      <CodeRunnerPanel
                        code={code}
                        tailCode={tailCode}
                        className="h-full"
                      />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle className="h-0" />

                  <ResizablePanel defaultSize={60} minSize={20} className="">
                    <div className="h-full min-h-0 overflow-y-auto">
                      <Chat code={code} onCodeChange={onCodeChange} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
