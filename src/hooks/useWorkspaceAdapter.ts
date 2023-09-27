import { modals } from "@mantine/modals";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import { BrowserWorkspaceAdapter } from "../workspaces/browser-workspace-adapter.ts";
import { LocalWorkspaceAdapter } from "../workspaces/local-workspace-adapter.ts";
import {
	WorkspaceAdapter,
	WorkspaceAdapterType,
} from "../workspaces/workspace-adapter.ts";

export const useWorkspaceAdapter = () => {
	const [adapterType, setAdapterType] = useLocalStorage<WorkspaceAdapterType>(
		"workspace-type",
		WorkspaceAdapterType.BROWSER,
	);
	const [adapter, setAdapter] = useState<WorkspaceAdapter>();

	const handleNewFile = async () => {
		try {
			switch (adapterType) {
				case WorkspaceAdapterType.LOCAL:
					setAdapter(await LocalWorkspaceAdapter.withNewFile());
					break;
				case WorkspaceAdapterType.BROWSER:
					setAdapter(await BrowserWorkspaceAdapter.withNewFile());
					break;
			}
		} catch (e) {
			console.log("handleNewFile caught Error", e);
		} finally {
			modals.closeAll();
		}
	};
	const handleOpenFile = async () => {
		try {
			switch (adapterType) {
				case WorkspaceAdapterType.LOCAL:
					setAdapter(await LocalWorkspaceAdapter.withExistingFile());
					break;
				case WorkspaceAdapterType.BROWSER:
					setAdapter(await BrowserWorkspaceAdapter.withExistingFile());
					break;
			}
		} catch (e) {
			console.log("handleOpenFile caught Error", e);
		} finally {
			modals.closeAll();
		}
	};

	const handleSave = async () => {
		adapter?.write();
	};

	return {
		adapter,
		handleNewFile,
		handleOpenFile,
		handleSave,
		adapterType,
		setAdapterType,
		setAdapter,
	};
};
