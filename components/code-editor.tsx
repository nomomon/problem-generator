"use client";

import * as React from "react";
import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/index";

const editorVariants = cva(
  "border rounded-md overflow-hidden focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-all",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        filled: "bg-muted border-muted",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        sm: "h-32",
        default: "h-64",
        lg: "h-96",
        xl: "h-[32rem]",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface CodeEditorProps extends VariantProps<typeof editorVariants> {
  value?: string;
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  onMount?: OnMount;
  readOnly?: boolean;
  loading?: React.ReactNode;
  className?: string;
  options?: {
    minimap?: { enabled: boolean };
    fontSize?: number;
    lineNumbers?: "on" | "off" | "relative" | "interval";
    wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded";
    scrollBeyondLastLine?: boolean;
    automaticLayout?: boolean;
    tabSize?: number;
    insertSpaces?: boolean;
    renderWhitespace?: "none" | "boundary" | "selection" | "trailing" | "all";
    showUnused?: boolean;
    folding?: boolean;
    foldingHighlight?: boolean;
    unfoldOnClickAfterEndOfLine?: boolean;
    contextmenu?: boolean;
  };
}

const CodeEditor = React.forwardRef<HTMLDivElement, CodeEditorProps>(
  (
    {
      value,
      defaultValue,
      language = "javascript",
      onChange,
      onMount,
      readOnly = false,
      loading,
      className,
      variant,
      size,
      options = {},
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      // Configure TypeScript/JavaScript language features
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      });

      // Set diagnostics options
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      // Add common library definitions
      const libUri = "ts:filename/facts.d.ts";
      const libSource = [
        "declare var console: { log(msg: any): void; };",
        "declare var setTimeout: (callback: () => void, delay: number) => number;",
        "declare var clearTimeout: (id: number) => void;",
      ].join("\n");

      if (!monaco.editor.getModel(monaco.Uri.parse(libUri))) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          libSource,
          libUri,
        );
      }

      onMount?.(editor, monaco);
    };

    const defaultOptions = {
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on" as const,
      wordWrap: "on" as const,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: "selection" as const,
      showUnused: true,
      folding: true,
      foldingHighlight: true,
      unfoldOnClickAfterEndOfLine: false,
      contextmenu: true,
      smoothScrolling: true,
      cursorBlinking: "blink" as const,
      cursorSmoothCaretAnimation: "on" as const,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly,
      theme: theme === "dark" ? "vs-dark" : "vs-light",
      ...options,
    };

    if (!isClient) {
      return (
        <div
          ref={ref}
          className={cn(editorVariants({ variant, size }), className)}
          {...props}
        >
          <div className="flex h-full items-center justify-center">
            {loading || (
              <div className="text-muted-foreground">Loading editor...</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(editorVariants({ variant, size }), className)}
        {...props}
      >
        <Editor
          value={value}
          defaultValue={defaultValue}
          language={language}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          onChange={onChange}
          onMount={handleEditorDidMount}
          loading={loading}
          options={defaultOptions}
        />
      </div>
    );
  },
);

CodeEditor.displayName = "CodeEditor";

export { CodeEditor, editorVariants };
