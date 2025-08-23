"use client";

import { CodeEditor } from "@/components/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { codeRunner, type CodeExecutionResult } from "@/lib/utils/code-runner";
import { useState } from "react";
import { Play, Square, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const CreateProblemPage = () => {
  usePageNavigation({
    title: "Create New Problem",
    breadcrumbs: [{ label: "Create New Problem" }],
  });

  const [code, setCode] = useState<string | undefined>(defaultCode);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (!code) return;

    setIsRunning(true);
    try {
      const executionResult = await codeRunner.executeCode(code + tailCode);
      setResult(executionResult);
    } catch (error) {
      setResult({
        output: "",
        error: error instanceof Error ? error.message : String(error),
        logs: [],
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 h-[80vh] flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <Button onClick={runCode} disabled={isRunning || !code}>
          {isRunning ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </div>
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
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Output</CardTitle>
                  {result && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {result.executionTime}ms
                      </Badge>
                      {result.error ? (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Error
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-auto">
                {result ? (
                  <>
                    {result.logs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Console Output
                        </h4>
                        <div className="bg-muted p-3 rounded-md text-sm font-mono max-h-40 overflow-auto">
                          {result.logs.map((log, index) => (
                            <div key={index} className="mb-1">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.output && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Return Value
                        </h4>
                        <div className="bg-muted p-3 rounded-md text-sm font-mono max-h-40 overflow-auto">
                          {result.output}
                        </div>
                      </div>
                    )}

                    {result.error && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-destructive">
                          Error
                        </h4>
                        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md text-sm font-mono text-destructive max-h-40 overflow-auto">
                          {result.error}
                        </div>
                      </div>
                    )}

                    {!result.output &&
                      !result.error &&
                      result.logs.length === 0 && (
                        <div className="text-muted-foreground text-sm">
                          No output produced
                        </div>
                      )}
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Click "Run Code" to execute your JavaScript code
                  </div>
                )}
              </CardContent>
            </Card>
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
