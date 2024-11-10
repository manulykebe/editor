import React, { useEffect, useState, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MenuBar } from "./components/MenuBar";
import { ActivityBar } from "./components/ActivityBar";
import { SidePanel } from "./components/SidePanel";
import { Editor } from "./components/Editor";
import { TabBar } from "./components/TabBar";
import { Footer } from "./components/Footer";
import { BottomPanel } from "./components/BottomPanel";
import { useEditorStore } from "./store/editorStore";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
	const [isLoading, setIsLoading] = useState(true);
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
							<Panel id="editor-panel" order={1}>
								<div className="h-full flex flex-col">
									<TabBar />
									<div className="flex-1 overflow-hidden">
										<Editor />
									</div>
								</div>
							</Panel>
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
}

export default App;
