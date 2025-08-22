"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";

const CreateProblemPage = () => {
  usePageNavigation({
    title: "Create New Problem",
    breadcrumbs: [{ label: "Create New Problem" }],
  });

  return <div className="p-6"></div>;
};

export default CreateProblemPage;
