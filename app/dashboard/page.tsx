"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <Button onClick={() => router.push("/dashboard/create")}>
          Create New Problem
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Problems</h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div>Loading problems...</div>
          </div>
        ) : problems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't created any problems yet.
              </p>
              <Button onClick={() => router.push("/dashboard/create")}>
                Create Your First Problem
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    Problem #{problem.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created: {new Date(problem.createdAt).toLocaleDateString()}
                  </p>
                  <Link href={`/dashboard/problems/${problem.id}`}>
                    <Button variant="outline" className="w-full">
                      View Problem
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
