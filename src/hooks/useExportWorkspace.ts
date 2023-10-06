import { showNotification } from "@mantine/notifications";
import { kebabCase } from "lodash";
import { useCallback } from "react";
import { Workspace } from "../workspace/Workspace.ts";

export const useExportWorkspace = (workspace: Workspace) => {
	return useCallback(
		async (handle?: FileSystemFileHandle) => {
			let h = handle;
			if (!h) {
				// @ts-ignore
				h = await showSaveFilePicker({
					suggestedName: `${kebabCase(workspace.name)}.json`,
				});
			}

			if (!h) {
				throw new Error("Unable to acquire file system handle");
			}

			const writable: FileSystemWritableFileStream = await h.createWritable();

			await writable.write(JSON.stringify(workspace.toDto()));
			await writable.close();

			showNotification({ message: "Save Success" });

			return h;
		},
		[workspace],
	);
};
