"use client";

import { useEffect, useMemo } from "react";
import { useNavigation } from "@/lib/contexts/navigation-context";

interface UsePageNavigationProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function usePageNavigation({
  title,
  breadcrumbs,
}: UsePageNavigationProps) {
  const { setNavigation } = useNavigation();

  const navigationData = useMemo(
    () => ({
      title,
      breadcrumbs: breadcrumbs || [{ label: title }],
    }),
    [title, breadcrumbs],
  );

  useEffect(() => {
    setNavigation(navigationData);
  }, [navigationData, setNavigation]);
}

export function useUpdateNavigation() {
  const { setNavigation, updateTitle, updateBreadcrumbs } = useNavigation();

  return useMemo(
    () => ({
      setNavigation,
      updateTitle,
      updateBreadcrumbs,
    }),
    [setNavigation, updateTitle, updateBreadcrumbs],
  );
}
