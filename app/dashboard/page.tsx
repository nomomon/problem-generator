"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProblemsList } from "@/components/problem-editor/problems-list";

interface Problem {
  id: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  usePageNavigation({
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Here you can view and manage your
            problems.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/dashboard/problems/create")}>
            Create New Problem
          </Button>
          <Link href="/dashboard/problems">
            <Button variant="outline">View All Problems</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Problems
            {problems.length > 3 && (
              <Link
                href="/dashboard/problems"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all ({problems.length})
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div>Loading problems...</div>
            </div>
          ) : (
            <ProblemsList
              problems={problems.slice(0, 3)} // Show only first 3 problems
              onProblemDeleted={handleProblemDeleted}
              showCreateButton={false} // Don't show create button in the list
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
