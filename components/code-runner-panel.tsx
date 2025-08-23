"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { codeRunner, type CodeExecutionResult } from "@/lib/utils/code-runner";
import { useState } from "react";
import { Play, Square, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface CodeRunnerPanelProps {
  code?: string;
  tailCode?: string;
  disabled?: boolean;
  className?: string;
}

export const CodeRunnerPanel = ({
  code,
  tailCode = "",
  disabled = false,
  className = "",
}: CodeRunnerPanelProps) => {
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
    <div className={`flex flex-col h-full ${className}`}>
      <div className="mb-4 flex-shrink-0">
        <Button onClick={runCode} disabled={isRunning || !code || disabled}>
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

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Output</CardTitle>
            {result && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
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
                  <h4 className="text-sm font-medium mb-2">Console Output</h4>
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
                  <h4 className="text-sm font-medium mb-2">Return Value</h4>
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

              {!result.output && !result.error && result.logs.length === 0 && (
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
    </div>
  );
};
