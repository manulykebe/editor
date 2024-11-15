import React, { useEffect, useState, useCallback } from "react";
import { ActivityBar } from "./components/ActivityBar";
import { BottomPanel } from "./components/BottomPanel";
import { Editor } from "./components/Editor";
import { Footer } from "./components/Footer";
import { LoadingScreen } from "./components/LoadingScreen";
import { MenuBar } from "./components/MenuBar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SidePanel } from "./components/SidePanel";
import { TabBar } from "./components/TabBar";
import { useEditorStore } from "./store/editorStore";
import { useWorkflowStore } from "./store/workflowStore";
import { WorkflowEditor } from "./components/workflow/WorkflowEditor";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { currentFile } = useEditorStore();
	const { currentWorkflow } = useWorkflowStore();
	const { isBottomPanelVisible } = useEditorStore();

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<div className="h-screen bg-zinc-900 text-white flex flex-col">
			<MenuBar />
			<div className="flex-1 overflow-hidden flex">
				<ActivityBar />
				<PanelGroup direction="horizontal" className="flex-1">
					<Panel
						id="side-panel"
						order={1}
						defaultSize={50}
						minSize={15}
						maxSize={100}
						// style={{
						// 	minWidth: "150px", // set minimum width in pixels
						// 	maxWidth: "450px", // set maximum width in pixels
						// }}
					>
						<SidePanel />
					</Panel>

					<PanelResizeHandle className="w-1 bg-zinc-700 hover:bg-blue-500 transition-colors" />

					<Panel id="main-panel" order={2}>
						<PanelGroup direction="vertical" className="h-full">
							{currentWorkflow ? (
								<Panel id="floweditor-panel" order={1}>
									<div className="h-full flex flex-col">
										<div className="flex-1 overflow-hidden">
											<WorkflowEditor />
										</div>
									</div>
								</Panel>
							) : (
								<Panel id="editor-panel" order={1}>
									<div className="h-full flex flex-col">
										<TabBar />
										<div className="flex-1 overflow-hidden">
											<Editor />
										</div>
									</div>
								</Panel>
							)}

							{isBottomPanelVisible && (
								<>
									<PanelResizeHandle className="h-1 bg-zinc-700 hover:bg-blue-500 transition-colors" />
									<Panel
										id="bottom-panel"
										order={2}
										defaultSize={30}
										minSize={20}
									>
										<BottomPanel />
									</Panel>
								</>
							)}
						</PanelGroup>
					</Panel>
				</PanelGroup>
			</div>
			<Footer />
		</div>
	);
};

export default App;
