import { Button, FileInput, Group, Stack } from "@mantine/core";
import { modals, openModal } from "@mantine/modals";
import jsfd from "js-file-download";
import { FC } from "react";
import { WorkspaceAdapter } from "../workspaces/workspace-adapter.ts";
import { showErrorNotification } from "./showErrorNotification.ts";

export const exportWorkspace = async (adapter: WorkspaceAdapter) => {
	const dump = await adapter.c4db.exportJSON();
	jsfd(JSON.stringify(dump), `${new Date().toISOString()}.json`);
};

const ImportForm: FC<{ adapter: WorkspaceAdapter }> = ({ adapter }) => {
	const handleImport = async (file: File) => {
		try {
			await adapter.c4db.importJSON(JSON.parse(await file.text()));
		} catch (error) {
			showErrorNotification(error as Error);
		} finally {
			modals.closeAll();
		}
	};

	return (
		<Stack>
			<FileInput placeholder="Workspace Export" onChange={handleImport} />
			<Group>
				<Button variant={"outline"} onClick={() => modals.closeAll()}>
					Cancel
				</Button>
			</Group>
		</Stack>
	);
};

export const importWorkspace = async (adapter: WorkspaceAdapter) => {
	openModal({
		title: "Import Workspace",
		children: <ImportForm adapter={adapter} />,
	});
};
