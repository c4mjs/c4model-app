import { createContext, useContext } from "react";
import { RxCollection, RxDatabase, addRxPlugin, createRxDatabase } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);

export type WorkspaceDb = RxDatabase<{
	groups: RxCollection;
}>;

export const createWorkspaceDb = async (id: string): Promise<WorkspaceDb> => {
	const db: WorkspaceDb = await createRxDatabase({
		name: `c4db_${id}`,
		// @ts-ignore
		storage: getRxStorageMemory(),
		ignoreDuplicate: true,
	});

	await db.addCollections({
		groups: {
			schema: {
				version: 0,
				primaryKey: "id",
				type: "object",
				properties: {
					id: { type: "string", maxLength: 32 },
					name: { type: "string" },
				},
			},
		},
	});

	return db;
};

export const C4DbContext = createContext<WorkspaceDb>(undefined as any);
export const useC4Db = () => useContext<WorkspaceDb>(C4DbContext);
export const C4DbProvider = C4DbContext.Provider;
