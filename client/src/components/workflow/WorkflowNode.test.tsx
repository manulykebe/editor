// WorkflowNode.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkflowNode } from './WorkflowNode';
import '@testing-library/jest-dom';

// Mock the zustand store
jest.mock('../../store/workflowStore', () => ({
  useWorkflowStore: jest.fn()
}));

// Provide a mock implementation for useWorkflowStore
const mockStore = {
  currentWorkflow: {
    id: 'workflow1',
    nodes: {
      node1: { data: { /* ...mock data... */ } }
    },
    edges: []
  },
  setCurrentWorkflow: jest.fn(),
  // Include any other state or actions your component relies on
};

// Set the mock return value
(useWorkflowStore as jest.Mock).mockReturnValue(mockStore);

describe('WorkflowNode', () => {
	// Basic test props
	const mockProps = {
		id: 'test-node-id',
		data: {
			name: 'Test Node',
			description: 'Test Description',
			repeat: 1,
			callbacks: {
				onStart: false,
				onStartRun: false,
				onComplete: false,
				onCompleteRun: false,
				onReject: false,
				onRejectRun: false,
				onAbort: false,
				onAbortRun: false
			}
		},
		selected: false
	};

	const mockCurrentWorkflow = {
		id: 'test-workflow-id',
		name: 'Test Workflow'
	};

	beforeEach(() => {
		// Setup store mock
		(useWorkflowStore as unknown as jest.Mock).mockImplementation(() => ({
			currentWorkflow: mockCurrentWorkflow
		}));
		
		// Reset fetch mock
		(global.fetch as jest.Mock).mockReset();
	});

	test('renders node with basic information', () => {
		render(<WorkflowNode {...mockProps} />);
		expect(screen.getByText('Test Node')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
		expect(screen.getByText('x1')).toBeInTheDocument();
	});

	test('handleSaveCallback saves callback code correctly', async () => {
		// Mock successful fetch response
		(global.fetch as jest.Mock).mockImplementationOnce(() => 
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ content: 'test code' })
			})
		);

		const { getByTitle } = render(<WorkflowNode {...mockProps} />);

		// Find and click the onStart callback marker
		const startMarker = getByTitle('Create onStart callback');
		fireEvent.click(startMarker);

		// Wait for editor to open and verify it loaded with initial code
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		// Mock the editor change event
		const mockCode = 'console.log("test")';
		const saveButton = screen.getByText('Save');
		
		// Mock the PUT request for saving
		(global.fetch as jest.Mock).mockImplementationOnce(() => 
			Promise.resolve({
				ok: true
			})
		);

		// Trigger save
		fireEvent.click(saveButton);

		// Verify the save request
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/api/files',
				expect.objectContaining({
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: expect.any(String)
				})
			);
		});

		// Verify editor closes after successful save
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	test('handleSaveCallback handles errors correctly', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		
		// Mock failed fetch response
		(global.fetch as jest.Mock).mockImplementationOnce(() => 
			Promise.resolve({
				ok: false,
				status: 500
			})
		);

		const { getByTitle } = render(<WorkflowNode {...mockProps} />);

		// Find and click the onStart callback marker
		const startMarker = getByTitle('Create onStart callback');
		fireEvent.click(startMarker);

		// Wait for editor to open
		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		// Trigger save
		const saveButton = screen.getByText('Save');
		fireEvent.click(saveButton);

		// Verify error was logged
		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				'Error saving callback file:',
				expect.any(Error)
			);
		});

		consoleSpy.mockRestore();
	});

	test('editor receives and handles code updates correctly', async () => {
		const { getByTitle } = render(<WorkflowNode {...mockProps} />);

		// Mock successful initial fetch
		(global.fetch as jest.Mock).mockImplementationOnce(() => 
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ content: 'initial code' })
			})
		);

		// Open editor
		const startMarker = getByTitle('Create onStart callback');
		fireEvent.click(startMarker);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		// Verify initial code loaded
		const editor = screen.getByRole('dialog');
		expect(editor).toHaveTextContent('initial code');

		// Mock successful save
		(global.fetch as jest.Mock).mockImplementationOnce(() => 
			Promise.resolve({ ok: true })
		);

		// Save changes
		fireEvent.click(screen.getByText('Save'));

		// Verify callback state updated
		await waitFor(() => {
			expect(mockProps.data.callbacks.onStart).toBe(true);
		});
	});
});