import { create } from 'zustand';

interface EditorStore {
  isBottomPanelVisible: boolean;
  isDarkMode: boolean;
  toggleBottomPanel: () => void;
  toggleDarkMode: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isBottomPanelVisible: false,
  isDarkMode: false,
  toggleBottomPanel: () => set((state) => ({ 
    isBottomPanelVisible: !state.isBottomPanelVisible 
  })),
  toggleDarkMode: () => set((state) => ({
    isDarkMode: !state.isDarkMode
  })),
}));