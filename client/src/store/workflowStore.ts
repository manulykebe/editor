import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { useEditorStore } from './editorStore';

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  loadWorkflows: () => Promise<void>;
  saveWorkflow: (workflow: Workflow) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,

  setCurrentWorkflow: (workflow) => {
    set({ currentWorkflow: workflow });
    // Reset currentFile
    useEditorStore.getState().setCurrentFile(null);
  },

  addWorkflow: (workflow) => 
    set((state) => ({ workflows: [...state.workflows, workflow] })),

  updateWorkflow: (workflow) => 
    set((state) => ({
      workflows: state.workflows.map((w) => 
        w.id === workflow.id ? workflow : w
      ),
      currentWorkflow: workflow
    })),

  deleteWorkflow: (id) => 
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow
    })),

  loadWorkflows: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/workflows');
      const workflows = await response.json();
      set({ workflows });
      
      // Load initial workflow if none exists
      if (workflows.length === 0) {
        const newWorkflow: Workflow = {
          id: crypto.randomUUID(),
          name: 'New Workflow',
          description: 'A new workflow',
          nodes: [],
          edges: []
        };
        await get().saveWorkflow(newWorkflow);
        set({ workflows: [newWorkflow], currentWorkflow: newWorkflow });
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  },

  saveWorkflow: async (workflow) => {
    try {
      await fetch('http://localhost:3000/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      get().addWorkflow(workflow);
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  }
}));