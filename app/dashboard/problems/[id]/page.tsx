"use client";

import { CodeEditor } from "@/components/code-editor";
import { CodeRunnerPanel } from "@/components/code-runner-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateProblem } from "@/app/dashboard/create/actions";
import { toast } from "sonner";

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProblemPage = ({ params }: ProblemPageProps) => {
  const { id } = use(params);

  const [problem, setProblem] = useState<{
    id: number;
    functionJs: string;
    createdAt: string;
  } | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  usePageNavigation({
    title: `Problem #${id}`,
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: `Problem #${id}` },
    ],
  });

  useEffect(() => {
    // Fetch problem data
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/api/problems/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProblem(data);
          setCurrentCode(data.functionJs);
        } else {
          console.error("Failed to fetch problem");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges || !problem) return;

    setIsSaving(true);
    try {
      await updateProblem(id, currentCode);
      setProblem({ ...problem, functionJs: currentCode });
      setHasUnsavedChanges(false);
      toast.success("Problem saved successfully!");
    } catch (error) {
      console.error("Error saving problem:", error);
      toast.error("Failed to save problem. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, problem, id, currentCode]);

  const handleCodeChange = (newCode: string | undefined) => {
    const code = newCode || "";
    setCurrentCode(code);
    setHasUnsavedChanges(code !== problem?.functionJs);
  };

  // Add keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        if (hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, isSaving, handleSave]);

  if (loading) {
    return (
      <div className="p-6 h-[80vh] flex items-center justify-center">
        <div>Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6 h-[80vh] flex flex-col items-center justify-center">
        <div className="mb-4">Problem not found</div>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 h-[80vh] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Problem #{problem.id}</h1>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(problem.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            variant={hasUnsavedChanges ? "default" : "secondary"}
          >
            {isSaving
              ? "Saving..."
              : hasUnsavedChanges
                ? "Save Changes"
                : "Saved"}
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="p-4">
            <CodeEditor
              className="h-full py-4"
              value={currentCode}
              onChange={handleCodeChange}
              defaultValue={problem.functionJs}
              size="full"
              readOnly={false}
            />
          </ResizablePanel>
          <ResizableHandle withHandle={true} />
          <ResizablePanel className="p-4">
            <CodeRunnerPanel code={currentCode} tailCode={tailCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

const tailCode = `
const { text } = generateProblem();
return text;`;

export default ProblemPage;
