"use client";

import { CodeEditor } from "@/components/problem-editor/code-editor";
import { CodeRunnerPanel } from "@/components/problem-editor/code-runner-panel";
import { PanelHeader } from "@/components/problem-editor/panel-header";
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
            </div>

            {/* Toolbar */}
            {toolbar && (
              <div className="flex items-center gap-2">{toolbar}</div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0 p-3">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30} className="p-4">
            <Card className="h-full border shadow-sm flex flex-col">
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

          <ResizableHandle className="w-1 bg-border hover:bg-accent transition-colors" />

          <ResizablePanel defaultSize={50} minSize={30} className="p-4">
            <Card className="h-full border shadow-sm flex flex-col">
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
