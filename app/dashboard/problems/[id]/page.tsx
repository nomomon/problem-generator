"use client";

import { ProblemEditorLayout } from "@/components/problem-editor/problem-editor-layout";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateProblem, deleteProblem } from "../actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

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
        <Button onClick={() => router.push("/dashboard/problems")}>
          Back to Problems
        </Button>
      </div>
    );
  }

  const headerActions = (
    <div className="flex justify-between items-center">
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Problem</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete Problem #{problem.id}? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={() => router.push("/dashboard/problems")}
          variant="outline"
        >
          Back to Problems
        </Button>
      </div>
    </div>
  );

  return (
    <ProblemEditorLayout
      code={currentCode}
      onCodeChange={handleCodeChange}
      defaultValue={problem.functionJs}
      headerActions={headerActions}
    />
  );
};

export default ProblemPage;
