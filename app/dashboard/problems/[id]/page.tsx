"use client";

import {
  ProblemEditorLayout,
  ProblemToolbar,
  ProblemDetails,
} from "@/components/problem-editor";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { updateProblem, deleteProblem, getProblemDetails } from "../actions";
import { toast } from "sonner";

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

type ProblemData = {
  id: number;
  function_js: string | null;
  name: string | null;
  assets: string[] | null;
  difficulty: "easy" | "medium" | "hard" | null;
  topics?: string[];
  createdAt: string;
  authorId: string;
};

const ProblemPage = ({ params }: ProblemPageProps) => {
  const { id } = use(params);

  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [currentDetails, setCurrentDetails] = useState<ProblemDetails>({});
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
        const data = await getProblemDetails(id);
        setProblem(data);
        setCurrentCode(data.function_js || "");
        setCurrentDetails({
          name: data.name || undefined,
          assets: data.assets || undefined,
          difficulty: data.difficulty,
          topics: data.topics,
        });
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast.error("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const checkForChanges = useCallback(
    (code: string, details: ProblemDetails) => {
      if (!problem) return false;

      const codeChanged = code !== (problem.function_js || "");
      const nameChanged = (details.name || null) !== (problem.name || null);
      const assetsChanged =
        JSON.stringify(details.assets || null) !==
        JSON.stringify(problem.assets || null);
      const difficultyChanged =
        (details.difficulty || null) !== (problem.difficulty || null);
      const topicsChanged =
        JSON.stringify(details.topics || null) !==
        JSON.stringify(problem.topics || null);

      return (
        codeChanged ||
        nameChanged ||
        assetsChanged ||
        difficultyChanged ||
        topicsChanged
      );
    },
    [problem],
  );

  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges || !problem) return;

    setIsSaving(true);
    try {
      await updateProblem(id, currentCode, currentDetails);

      // Update the problem state with saved values
      setProblem({
        ...problem,
        function_js: currentCode,
        name: currentDetails.name || null,
        assets: currentDetails.assets || null,
        difficulty: currentDetails.difficulty || null,
        topics: currentDetails.topics,
      });

      setHasUnsavedChanges(false);
      toast.success("Problem saved successfully!");
    } catch (error) {
      console.error("Error saving problem:", error);
      toast.error("Failed to save problem. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, problem, id, currentCode, currentDetails]);

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
  const handleCodeChange: React.Dispatch<
    React.SetStateAction<string | undefined>
  > = (input) => {
    setCurrentCode((prevCode) => {
      const nextCode = typeof input === "function" ? input(prevCode) : input;
      const code = nextCode ?? "";
      setHasUnsavedChanges(checkForChanges(code, currentDetails));
      return code;
    });
  };

  const handleDetailsChange = (newDetails: ProblemDetails) => {
    setCurrentDetails(newDetails);
    setHasUnsavedChanges(checkForChanges(currentCode, newDetails));
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

  const displayTitle = currentDetails.name || `Problem #${problem.id}`;

  return (
    <div className="h-full min-h-0 flex-1">
      <ProblemEditorLayout
        code={currentCode}
        onCodeChange={handleCodeChange}
        details={currentDetails}
        onDetailsChange={handleDetailsChange}
        defaultValue={problem.function_js || ""}
        title={displayTitle}
        subtitle={`Created: ${new Date(problem.createdAt).toLocaleDateString()}`}
        status={status}
        toolbar={toolbar}
      />
    </div>
  );
};

export default ProblemPage;
