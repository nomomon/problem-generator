"use client";

import { ProblemsDataTable, type Problem } from "./problems-data-table";

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
  return (
    <ProblemsDataTable
      problems={problems}
      onProblemDeleted={onProblemDeleted}
      showCreateButton={showCreateButton}
    />
  );
}
