"use client";

import { ProblemEditorLayout } from "@/components/problem-editor/problem-editor-layout";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createProblem } from "../actions";
import { toast } from "sonner";

const CreateProblemPage = () => {
  usePageNavigation({
    title: "Create New Problem",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Problems", href: "/dashboard/problems" },
      { label: "Create New Problem" },
    ],
  });

  const defaultCode = `
function generateProblem() {
    return {
        text: "Problem text",
    };
}
`.trim();

  const [code, setCode] = useState<string | undefined>(defaultCode);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!code || code.trim() === "") {
      toast.error("Please write some code before saving");
      return;
    }

    startTransition(async () => {
      try {
        await createProblem(code);
        toast.success("Problem created successfully!");
      } catch (error) {
        console.error("Error creating problem:", error);
        toast.error("Failed to create problem. Please try again.");
      }
    });
  };

  const headerActions = (
    <div className="flex justify-end">
      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : "Save Problem"}
      </Button>
    </div>
  );

  return (
    <ProblemEditorLayout
      code={code}
      onCodeChange={setCode}
      defaultValue={defaultCode}
      headerActions={headerActions}
    />
  );
};

export default CreateProblemPage;
