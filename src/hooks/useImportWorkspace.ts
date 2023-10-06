import { useCallback } from "react";
import { Workspace } from "../workspace/Workspace.ts";

export const useImportWorkspace = () => {
	return useCallback(async () => {
		// @ts-ignore
		const [handle] = await showOpenFilePicker();
		const file = await handle.getFile();
		const dump = await file.text();

		const workspace = Workspace.fromDto(JSON.parse(dump));

		return { handle, workspace };
	}, []);
};
