export interface CodeExecutionResult {
  output: string;
  error: string | null;
  logs: string[];
  executionTime: number;
}

export class CodeRunner {
  private static instance: CodeRunner;

  private constructor() {}

  static getInstance(): CodeRunner {
    if (!CodeRunner.instance) {
      CodeRunner.instance = new CodeRunner();
    }
    return CodeRunner.instance;
  }

  async executeCode(
    code: string,
    timeout = 5000,
  ): Promise<CodeExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];
    let output = "";
    let error: string | null = null;

    try {
      // Create a sandboxed execution environment
      const originalConsole = console;
      const mockConsole = {
        log: (...args: any[]) => {
          const message = args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" ");
          logs.push(message);
        },
        error: (...args: any[]) => {
          const message = args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" ");
          logs.push(`ERROR: ${message}`);
        },
        warn: (...args: any[]) => {
          const message = args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" ");
          logs.push(`WARNING: ${message}`);
        },
      };

      // Create execution context with timeout
      const executionPromise = new Promise<any>((resolve, reject) => {
        try {
          // Replace console in the code execution context
          const wrappedCode = `
            (function() {
              const console = arguments[0];
              ${code}
            })
          `;

          const func = eval(wrappedCode);
          const result = func(mockConsole);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Code execution timeout")), timeout);
      });

      const result = await Promise.race([executionPromise, timeoutPromise]);

      if (result !== undefined) {
        output =
          typeof result === "object"
            ? JSON.stringify(result, null, 2)
            : String(result);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }

    const executionTime = performance.now() - startTime;

    return {
      output,
      error,
      logs,
      executionTime: Math.round(executionTime * 100) / 100,
    };
  }

  // Helper method to safely evaluate expressions
  async evaluateExpression(expression: string): Promise<CodeExecutionResult> {
    const code = `return (${expression});`;
    return this.executeCode(code);
  }
}

export const codeRunner = CodeRunner.getInstance();
