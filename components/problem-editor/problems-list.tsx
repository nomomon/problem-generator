"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Eye, Edit } from "lucide-react";

interface Problem {
  id: number;
  createdAt: string;
}

interface ProblemsListProps {
  problems: Problem[];
  onProblemDeleted?: (problemId: number) => void;
  showCreateButton?: boolean;
}

export function ProblemsList({
  problems,
  onProblemDeleted,
  showCreateButton = true,
}: ProblemsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (problemId: number) => {
    setDeletingId(problemId);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/problems/${problemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Problem deleted successfully!");
          onProblemDeleted?.(problemId);
        } else {
          const error = await response.json();
          toast.error(error.message || "Failed to delete problem");
        }
      } catch (error) {
        console.error("Error deleting problem:", error);
        toast.error("Failed to delete problem. Please try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">
            You haven't created any problems yet.
          </p>
          {showCreateButton && (
            <Button onClick={() => router.push("/dashboard/problems/create")}>
              Create Your First Problem
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end">
          <Button onClick={() => router.push("/dashboard/problems/create")}>
            Create New Problem
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <Card key={problem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Problem #{problem.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Created: {new Date(problem.createdAt).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/problems/${problem.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending && deletingId === problem.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Problem</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete Problem #{problem.id}?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(problem.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
