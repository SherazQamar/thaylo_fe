import { create } from "zustand";

export interface RegisterChildDraft {
  localId: string;
  userName: string;
  grade: string;
  pin: string;
  files: File[];
}

interface ChildFields {
  userName: string;
  grade: string;
  pin: string;
}

interface RegisterWizardState {
  children: RegisterChildDraft[];
  addChild: (child: ChildFields) => void;
  updateChild: (localId: string, child: ChildFields) => void;
  removeChild: (localId: string) => void;
  setChildFiles: (localId: string, files: File[]) => void;
  reset: () => void;
}

export const useRegisterWizardStore = create<RegisterWizardState>((set) => ({
  children: [],
  addChild: (child) =>
    set((state) => ({
      children: [
        ...state.children,
        {
          localId: crypto.randomUUID(),
          userName: child.userName,
          grade: child.grade,
          pin: child.pin,
          files: [],
        },
      ],
    })),
  updateChild: (localId, child) =>
    set((state) => ({
      children: state.children.map((c) =>
        c.localId === localId
          ? {
              ...c,
              userName: child.userName,
              grade: child.grade,
              pin: child.pin,
            }
          : c,
      ),
    })),
  removeChild: (localId) =>
    set((state) => ({
      children: state.children.filter((c) => c.localId !== localId),
    })),
  setChildFiles: (localId, files) =>
    set((state) => ({
      children: state.children.map((c) =>
        c.localId === localId ? { ...c, files } : c,
      ),
    })),
  reset: () => set({ children: [] }),
}));
