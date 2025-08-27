"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { codeRunner, type CodeExecutionResult } from "@/lib/utils/code-runner";
import { useState, useEffect } from "react";
import {
  Play,
  Square,
  Clock,
  AlertCircle,
  CheckCircle2,
  Terminal,
} from "lucide-react";

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

  // Add keyboard shortcut for running code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!isRunning && code && !disabled) {
          runCode();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, code, disabled]);

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Run Button */}
      <div className="mb-4 flex-shrink-0">
        <Button
          onClick={runCode}
          disabled={isRunning || !code || disabled}
          className="w-full"
          size="sm"
        >
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

      {/* Results */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {result && (
          <div className="mb-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                {result.executionTime}ms
              </Badge>
              {result.error ? (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 text-xs"
                >
                  <AlertCircle className="h-3 w-3" />
                  Error
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Success
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-auto">
          {result ? (
            <div className="space-y-3">
              {result.logs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Console
                    </h4>
                  </div>
                  <div className="bg-muted/50 border rounded-md p-3 text-sm font-mono max-h-32 overflow-auto">
                    {result.logs.map((log, index) => (
                      <div key={index} className="text-muted-foreground">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.output && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Return Value
                  </h4>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm font-mono max-h-32 overflow-auto">
                    <div className="mb-2 font-semibold text-green-800 dark:text-green-400">
                      Problem text
                    </div>
                    <pre className="text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {JSON.parse(result.output).text}
                    </pre>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-sm font-mono max-h-32 overflow-auto">
                    <div className="mb-2 font-semibold text-green-800 dark:text-green-400">
                      Answer text
                    </div>
                    <pre className="text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {JSON.parse(result.output).answerText}
                    </pre>
                  </div>
                </div>
              )}

              {result.error && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-destructive uppercase tracking-wide">
                    Error
                  </h4>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm font-mono text-destructive max-h-32 overflow-auto">
                    <pre className="whitespace-pre-wrap">{result.error}</pre>
                  </div>
                </div>
              )}

              {!result.output && !result.error && result.logs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-sm">
                    No output produced
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Terminal className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-muted-foreground text-sm">
                Click "Run Code" to execute your JavaScript
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Press ⌘+Enter or use the button above
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
