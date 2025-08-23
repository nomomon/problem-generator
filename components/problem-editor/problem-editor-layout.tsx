"use client";

import { CodeEditor } from "@/components/code-editor";
import { CodeRunnerPanel } from "@/components/code-runner-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";

interface ProblemEditorLayoutProps {
  code: string | undefined;
  onCodeChange: (code: string | undefined) => void;
  defaultValue?: string;
  readOnly?: boolean;
  tailCode?: string;
  headerActions?: ReactNode;
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
  headerActions,
  className = "p-6 h-[80vh] flex flex-col",
}: ProblemEditorLayoutProps) {
  return (
    <div className={className}>
      {headerActions && <div className="mb-4">{headerActions}</div>}

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="p-4">
            <CodeEditor
              className="h-full py-4"
              value={code}
              onChange={onCodeChange}
              defaultValue={defaultValue}
              size="full"
              readOnly={readOnly}
            />
          </ResizablePanel>
          <ResizableHandle withHandle={true} />
          <ResizablePanel className="p-4">
            <CodeRunnerPanel code={code} tailCode={tailCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
