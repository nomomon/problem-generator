"use client";

import { CodeEditor } from "@/components/code-editor";
import { CodeRunnerPanel } from "@/components/code-runner-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState } from "react";

const CreateProblemPage = () => {
  usePageNavigation({
    title: "Create New Problem",
    breadcrumbs: [{ label: "Create New Problem" }],
  });

  const [code, setCode] = useState<string | undefined>(defaultCode);

  return (
    <div className="p-6 h-[80vh] flex flex-col">
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="p-4">
            <CodeEditor
              className="h-full py-4"
              value={code}
              onChange={setCode}
              defaultValue={defaultCode}
              size="full"
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
};

const defaultCode = `
function generateProblem() {
    return {
        text: "Problem text",
    };
}
`.trim();

const tailCode = `
const { text } = generateProblem();
return text;`;

export default CreateProblemPage;
