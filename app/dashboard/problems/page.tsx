"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect } from "react";
import { ProblemsList } from "@/components/problem-editor/problems-list";

interface Problem {
  id: number;
  createdAt: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  usePageNavigation({
    title: "Problems",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Problems" },
    ],
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (response.ok) {
          const data = await response.json();
          setProblems(data.problems);
        } else {
          console.error("Failed to fetch problems");
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemDeleted = (problemId: number) => {
    setProblems((prevProblems) =>
      prevProblems.filter((problem) => problem.id !== problemId),
    );
  };

  return (
    <div className="space-y-6 px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Problems</h1>
        <p className="text-muted-foreground">
          Manage and create your problems here.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div>Loading problems...</div>
        </div>
      ) : (
        <ProblemsList
          problems={problems}
          onProblemDeleted={handleProblemDeleted}
        />
      )}
    </div>
  );
}
