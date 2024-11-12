import { create } from 'zustand';
import { FileTreeItem } from '../types/FileSystem';

interface FileSystemState {
  files: FileTreeItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
  fetchFiles: () => Promise<void>;
  setFiles: (files: FileTreeItem[]) => void;
  startFileWatcher: () => void;
  stopFileWatcher: () => void;
  watcherInterval: NodeJS.Timeout | null;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  files: [],
  isLoading: false,
  error: null,
  lastUpdate: Date.now(),
  watcherInterval: null,

  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:3000/api/files/tree');
      const data = await response.json();
      set({ files: data, lastUpdate: Date.now() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch files' });
    } finally {
      set({ isLoading: false });
    }
  },

  setFiles: (files) => set({ files }),

  startFileWatcher: () => {
    const POLL_INTERVAL = 2000; // 2 seconds
    let watcherInterval: NodeJS.Timeout;

    const pollFiles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/files/tree');
        const data = await response.json();
        const currentFiles = get().files;
        
        // Compare timestamps or structure to detect changes
        if (JSON.stringify(currentFiles) !== JSON.stringify(data)) {
          set({ files: data, lastUpdate: Date.now() });
        }
      } catch (error) {
        console.error('File watcher error:', error);
      }
    };

    watcherInterval = setInterval(pollFiles, POLL_INTERVAL);
    
    // Store the interval ID in state for cleanup
    set({ watcherInterval });
  },

  stopFileWatcher: () => {
    const { watcherInterval } = get();
    if (watcherInterval) {
      clearInterval(watcherInterval);
      set({ watcherInterval: null });
    }
  },
}));