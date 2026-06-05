import { create } from "zustand";
import type { Child } from "@/types/api";

interface ChildAuthState {
  child: Child | null;
  setChild: (child: Child) => void;
  clearChild: () => void;
}

export const useChildAuthStore = create<ChildAuthState>((set) => ({
  child: null,
  setChild: (child) => set({ child }),
  clearChild: () => set({ child: null }),
}));
