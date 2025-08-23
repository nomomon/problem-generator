"use client";

import {
  ProblemEditorLayout,
  ProblemToolbar,
} from "@/components/problem-editor";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { updateProblem, deleteProblem } from "../actions";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  usePageNavigation({
    title: `Problem #${id}`,
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Problems", href: "/dashboard/problems" },
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

  const handleDelete = async () => {
    if (!problem) return;

    setIsDeleting(true);
    try {
      await deleteProblem(id);
      toast.success("Problem deleted successfully!");
      router.push("/dashboard/problems");
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const code = newCode || "";
    setCurrentCode(code);
    setHasUnsavedChanges(code !== problem?.functionJs);
  };

  const handleBack = () => {
    router.push("/dashboard/problems");
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="mb-4 text-muted-foreground">Problem not found</div>
        <ProblemToolbar onBack={handleBack} backLabel="Back to Problems" />
      </div>
    );
  }

  const toolbar = (
    <ProblemToolbar
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      isSaving={isSaving}
      saveDisabled={!hasUnsavedChanges}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      onBack={handleBack}
      backLabel="Back to Problems"
      code={currentCode}
    />
  );

  const status = hasUnsavedChanges
    ? { label: "Unsaved Changes", variant: "outline" as const }
    : { label: "Saved", variant: "secondary" as const };

  return (
    <div className="h-full min-h-0 flex-1">
      <ProblemEditorLayout
        code={currentCode}
        onCodeChange={handleCodeChange}
        defaultValue={problem.functionJs}
        title={`Problem #${problem.id}`}
        subtitle={`Created: ${new Date(problem.createdAt).toLocaleDateString()}`}
        status={status}
        toolbar={toolbar}
      />
    </div>
  );
};

export default ProblemPage;
