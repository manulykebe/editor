import { create } from 'zustand';

interface EditorStore {
  isBottomPanelVisible: boolean;
  toggleBottomPanel: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isBottomPanelVisible: false,
  toggleBottomPanel: () => set((state) => ({ 
    isBottomPanelVisible: !state.isBottomPanelVisible 
  })),
}));