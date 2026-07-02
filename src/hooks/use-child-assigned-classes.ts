"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchChildAssignedClasses, type ChildAssignedClass } from "@/lib/curriculum-api";

export function useChildAssignedClasses() {
  const [classes, setClasses] = useState<ChildAssignedClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchChildAssignedClasses();
      setClasses(items);
    } catch {
      setError("Unable to load your classes right now.");
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const primaryClass = classes[0] ?? null;
  const hasAssignedClass = classes.length > 0;

  return {
    classes,
    primaryClass,
    hasAssignedClass,
    isLoading,
    error,
    refresh,
  };
}
