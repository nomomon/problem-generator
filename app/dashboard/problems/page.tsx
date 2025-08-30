"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect } from "react";
import { ProblemsList, type Problem } from "@/components/problem-list";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  usePageNavigation({
    title: "Задачи",
    breadcrumbs: [{ label: "Панель", href: "/dashboard" }, { label: "Задачи" }],
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
        <h1 className="text-2xl font-bold tracking-tight">Задачи</h1>
        <p className="text-muted-foreground">
          Здесь вы можете просматривать и управлять всеми вашими задачами.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div>Загрузка</div>
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
