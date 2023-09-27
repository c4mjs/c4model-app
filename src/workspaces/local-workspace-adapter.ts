import { notifications, showNotification } from "@mantine/notifications";
import { showErrorNotification } from "../utils/showErrorNotification.ts";
import { WorkspaceAdapter } from "./workspace-adapter.ts";
import { WorkspaceDb, createWorkspaceDb } from "./workspace-db.ts";

export class LocalWorkspaceAdapter implements WorkspaceAdapter {
	readonly c4db: WorkspaceDb;

	private handle: FileSystemFileHandle;

	constructor(c4db: WorkspaceDb, handle: FileSystemFileHandle) {
		this.c4db = c4db;
		this.handle = handle;
	}

	static async withNewFile(): Promise<LocalWorkspaceAdapter> {
		const handle = await showSaveFilePicker({
			suggestedName: "untitled.json",
		});
		const c4db = await createWorkspaceDb(crypto.randomUUID());
		const adapter = new LocalWorkspaceAdapter(c4db, handle);
		await adapter.write();
		return adapter;
	}

	static async withExistingFile(): Promise<LocalWorkspaceAdapter> {
		const [handle] = await showOpenFilePicker();
		const c4db = await createWorkspaceDb(crypto.randomUUID());
		const adapter = new LocalWorkspaceAdapter(c4db, handle);
		await adapter.read();
		return adapter;
	}

	async read(): Promise<void> {
		try {
			const file = await this.handle.getFile();
			const dump = JSON.parse(await file.text());
			await this.c4db.importJSON(dump);
		} catch (error) {
			showErrorNotification(error as Error);
		}
	}

	async write(): Promise<void> {
		if (!this.handle) return;

		try {
			const writable = await this.handle.createWritable();
			const dump = await this.c4db.exportJSON();
			console.log(dump);
			await writable.write(JSON.stringify(dump));
			await writable.close();
			notifications.show({
				title: "Success",
				message: `Successfully Saved ${this.handle.name}`,
			});
		} catch (error) {
			showErrorNotification(error as Error);
		}
	}
}
