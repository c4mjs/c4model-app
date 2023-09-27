import { WorkspaceDb } from "./workspace-db.ts";

export enum WorkspaceAdapterType {
	BROWSER = "browser",
	LOCAL = "local",
}

export interface WorkspaceAdapter {
	readonly c4db: WorkspaceDb;
	read(): Promise<void>;
	write(): Promise<void>;
}
