"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface NavigationState {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

interface NavigationContextType {
  navigation: NavigationState;
  setNavigation: (navigation: NavigationState) => void;
  updateTitle: (title: string) => void;
  updateBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, setNavigationState] = useState<NavigationState>({
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  });

  const setNavigation = useCallback((newNavigation: NavigationState) => {
    setNavigationState((prev) => {
      // Only update if there's actually a change
      if (
        prev.title !== newNavigation.title ||
        JSON.stringify(prev.breadcrumbs) !==
          JSON.stringify(newNavigation.breadcrumbs)
      ) {
        return newNavigation;
      }
      return prev;
    });
  }, []);

  const updateTitle = useCallback((title: string) => {
    setNavigationState((prev) =>
      prev.title !== title ? { ...prev, title } : prev,
    );
  }, []);

  const updateBreadcrumbs = useCallback(
    (breadcrumbs: { label: string; href?: string }[]) => {
      setNavigationState((prev) =>
        JSON.stringify(prev.breadcrumbs) !== JSON.stringify(breadcrumbs)
          ? { ...prev, breadcrumbs }
          : prev,
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      navigation,
      setNavigation,
      updateTitle,
      updateBreadcrumbs,
    }),
    [navigation, setNavigation, updateTitle, updateBreadcrumbs],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
