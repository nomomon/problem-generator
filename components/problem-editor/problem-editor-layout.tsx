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

interface ProblemEditorLayoutProps {
  code: string | undefined;
  onCodeChange: (code: string | undefined) => void;
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
        text: "Problem text",
    };
}
`.trim();

const defaultTailCode = `
const { text } = generateProblem();
return text;`;

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
                  {details.difficulty.charAt(0).toUpperCase() +
                    details.difficulty.slice(1)}
                </Badge>
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
                <ProblemDetailsForm
                  details={details || {}}
                  onDetailsChange={onDetailsChange}
                  className="h-full overflow-y-auto"
                />
              </ResizablePanel>
              <ResizableHandle withHandle className="w-0" />
            </>
          )}

          {/* Code Editor Panel */}
          <ResizablePanel
            defaultSize={onDetailsChange ? 37.5 : 50}
            minSize={30}
            className="p-4 pr-0"
          >
            <Card className="h-full border shadow-sm flex flex-col rounded-r-none">
              <PanelHeader
                title="Code Editor"
                description="Write your JavaScript function"
              />
              <div className="flex-1 min-h-0 p-4">
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
            <Card className="h-full border shadow-sm flex flex-col rounded-l-none">
              <PanelHeader title="Output" description="Test and view results" />
              <div className="flex-1 min-h-0 p-4">
                <CodeRunnerPanel
                  code={code}
                  tailCode={tailCode}
                  className="h-full"
                />
              </div>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
