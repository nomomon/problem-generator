"use client";

import {
  ProblemEditorLayout,
  ProblemToolbar,
  ProblemDetails,
} from "@/components/problem-editor";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProblem } from "../actions";
import { toast } from "sonner";

const CreateProblemPage = () => {
  const router = useRouter();

  usePageNavigation({
    title: "Создать задачу",
    breadcrumbs: [
      { label: "Панель", href: "/dashboard" },
      { label: "Задачи", href: "/dashboard/problems" },
      { label: "Создать задачу" },
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
  const [details, setDetails] = useState<ProblemDetails>({});
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!code || code.trim() === "") {
      toast.error("Please write some code before saving");
      return;
    }

    startTransition(async () => {
      try {
        await createProblem(code, details);
        toast.success("Problem created successfully!");
      } catch (error) {
        console.error("Error creating problem:", error);
        toast.error("Failed to create problem. Please try again.");
      }
    });
  };

  const handleBack = () => {
    router.push("/dashboard/problems");
  };

  const hasChanges =
    code !== defaultCode ||
    !!details.name ||
    !!(details.assets && details.assets.length > 0) ||
    !!details.difficulty ||
    !!(details.topics && details.topics.length > 0);

  const toolbar = (
    <ProblemToolbar
      hasUnsavedChanges={hasChanges}
      onSave={handleSave}
      isSaving={isPending}
      saveDisabled={!code?.trim()}
      onBack={handleBack}
      backLabel="Обратно к задачам"
      code={code}
    />
  );

  const status = hasChanges
    ? { label: "Modified", variant: "outline" as const }
    : { label: "New Problem", variant: "secondary" as const };

  return (
    <div className="h-full">
      <ProblemEditorLayout
        code={code}
        onCodeChange={setCode}
        details={details}
        onDetailsChange={setDetails}
        defaultValue={defaultCode}
        title={details.name || "Create New Problem"}
        subtitle="Write your JavaScript function to generate problems"
        status={status}
        toolbar={toolbar}
      />
    </div>
  );
};

export default CreateProblemPage;
