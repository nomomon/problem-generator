"use client";

import { CodeEditor } from "@/components/code-editor";
import { CodeRunnerPanel } from "@/components/code-runner-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProblemPageProps {
  params: {
    id: string;
  };
}

const ProblemPage = ({ params }: ProblemPageProps) => {
  const [problem, setProblem] = useState<{
    id: number;
    functionJs: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  usePageNavigation({
    title: `Problem #${params.id}`,
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: `Problem #${params.id}` },
    ],
  });

  useEffect(() => {
    // Fetch problem data
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/api/problems/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProblem(data);
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
  }, [params.id]);

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
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel className="p-4">
            <CodeEditor
              className="h-full py-4"
              value={problem.functionJs}
              defaultValue={problem.functionJs}
              size="full"
              readOnly
            />
          </ResizablePanel>
          <ResizableHandle withHandle={true} />
          <ResizablePanel className="p-4">
            <CodeRunnerPanel code={problem.functionJs} tailCode={tailCode} />
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
