import { notifications } from "@mantine/notifications";
import { RxCollection, RxDatabase, RxDocument, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { openInputModal } from "../modals/openInputModal.tsx";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import { showErrorNotification } from "../utils/showErrorNotification.ts";
import { WorkspaceAdapter } from "./workspace-adapter.ts";
import { WorkspaceDb, createWorkspaceDb } from "./workspace-db.ts";

export type WorkspaceFile = { id: string; name: string; data: string };
export type WorkspaceFileDocument = RxDocument<WorkspaceFile>;

export type BrowserDb = RxDatabase<{
	workspaces: RxCollection<WorkspaceFileDocument>;
}>;

const getDatabase = async (): Promise<BrowserDb> => {
	const db: BrowserDb = await createRxDatabase({
		name: "browser-workspace-adapter",
		storage: getRxStorageDexie(),
		ignoreDuplicate: true,
	});

	await db.addCollections({
		workspaces: {
			schema: {
				version: 0,
				primaryKey: "id",
				type: "object",
				properties: {
					id: { type: "string", maxLength: 32 },
					name: { type: "string" },
					data: { type: "string" },
				},
			},
		},
	});

	return db;
};

const db = getDatabase();

export class BrowserWorkspaceAdapter implements WorkspaceAdapter {
	private readonly doc: WorkspaceFileDocument;
	readonly c4db: WorkspaceDb;

	constructor(c4db: WorkspaceDb, doc: WorkspaceFileDocument) {
		this.doc = doc;
		this.c4db = c4db;
	}

	static async withNewFile(): Promise<BrowserWorkspaceAdapter> {
		const workspaces = await db.then((it) => it.collections.workspaces);
		const workspaceMeta: WorkspaceFile = {
			id: crypto.randomUUID(),
			name: await new Promise<string>((resolve, reject) =>
				openInputModal({
					title: "New Workspace",
					inputProps: {
						placeholder: "Workspace name",
					},
					onCancel: reject,
					onConfirm: resolve,
				}),
			),
		};
		const doc: WorkspaceFileDocument = await workspaces.upsert(workspaceMeta);
		const c4db = await createWorkspaceDb(doc.get("id"), false);
		const adapter = new BrowserWorkspaceAdapter(c4db, doc);
		await adapter.write();
		return adapter;
	}

	static async withExistingFile(): Promise<BrowserWorkspaceAdapter> {
		const workspaces = await db.then((it) => it.collections.workspaces);
		const _workspaces = await workspaces.find().exec();
		const id = await new Promise<string>(async (resolve, reject) =>
			openSelectModal({
				title: "Open Workspace",
				selectProps: {
					placeholder: "Workspace",
					defaultValue: _workspaces[0].id,
					data: _workspaces.map((it) => ({
						value: it.id,
						label: it.name,
					})),
				},
				onCancel: reject,
				onConfirm: resolve,
			}),
		);
		const workspace = _workspaces.find((it) => it.id === id);
		if (!workspace)
			throw new Error("Failed to find selected workspace in storage");
		const c4db = await createWorkspaceDb(id, false);
		const adapter = new BrowserWorkspaceAdapter(c4db, workspace);
		await adapter.read();
		return adapter;
	}

	async read(): Promise<void> {
		if (!this.doc) return;

		try {
			const dump = JSON.parse(await this.doc.get("data"));
			await this.c4db.importJSON(dump);
		} catch (error) {
			showErrorNotification(error as Error);
		}
	}

	async write(): Promise<void> {
		if (!this.doc) return;

		try {
			const dump = await this.c4db.exportJSON();
			await this.doc.getLatest().patch({ data: JSON.stringify(dump) });
			notifications.show({
				title: "Success",
				message: `Successfully Saved ${this.doc.name}`,
			});
		} catch (error) {
			showErrorNotification(error as Error);
		}
	}
}
