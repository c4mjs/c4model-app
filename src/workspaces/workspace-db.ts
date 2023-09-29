import { merge } from "lodash";
import { createContext, useContext } from "react";
import {
	RxCollection,
	RxDatabase,
	RxJsonSchema,
	addRxPlugin,
	createRxDatabase,
} from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);

export const groupEntitySchema = z.object({
	id: z.string().max(64),
	type: z.literal("group").default("group"),
	name: z.string().default("Group name"),
	description: z.string().default("Description of the group."),
});

export const getNewGroupEntity = () =>
	groupEntitySchema.parse({ id: crypto.randomUUID() });

export const systemEntitySchema = z.object({
	id: z.string().max(64),
	type: z.literal("system").default("system"),
	name: z.string().default("System name"),
	description: z.string().default("Description of software system."),
	group: z.string(),
});

export const getNewSystemEntity = (group: string) =>
	systemEntitySchema.parse({ id: crypto.randomUUID(), group });

export const containerEntitySchema = z.object({
	id: z.string().max(64),
	type: z.literal("container").default("container"),
	variant: z
		.enum(["default", "microservice", "browser", "data", "queue", "mobile"])
		.default("default"),
	name: z.string().default("Container name"),
	description: z
		.string()
		.default("Description of container role/responsibility."),
	technology: z.string().default("e.g. SpringBoot, ElasticSearch, etc."),
	system: z.string(),
});

export const getNewContainerEntity = (system: string) =>
	containerEntitySchema.parse({ id: crypto.randomUUID(), system });

export const relationshipEntitySchema = z.object({
	id: z.string().max(64),
	description: z.string().default("e.g. Makes API calls"),
	technology: z.string().default("e.g. JSON/HTTP"),
	sender: z.string(),
	receiver: z.string(),
});

export const getNewRelationshipEntity = (sender: string, receiver = "") =>
	relationshipEntitySchema.parse({ id: crypto.randomUUID(), sender, receiver });

export type GroupEntity = z.infer<typeof groupEntitySchema>;
export type SystemEntity = z.infer<typeof systemEntitySchema>;
export type ContainerEntity = z.infer<typeof containerEntitySchema>;
export type RelationshipEntity = z.infer<typeof relationshipEntitySchema>;

export type WorkspaceDb = RxDatabase<{
	groups: RxCollection<GroupEntity>;
	systems: RxCollection<SystemEntity>;
	containers: RxCollection<ContainerEntity>;
	relationships: RxCollection<RelationshipEntity>;
}>;

export const createWorkspaceDb = async (id: string): Promise<WorkspaceDb> => {
	const db: WorkspaceDb = await createRxDatabase({
		name: `c4db_${id}`,
		// @ts-ignore
		storage: getRxStorageMemory(),
		ignoreDuplicate: true,
	});

	const baseSchema: RxJsonSchema<any> = {
		version: 0,
		primaryKey: "id",
		type: "object",
		properties: {},
		required: [],
	};

	await db.addCollections({
		groups: {
			schema: merge({}, baseSchema, zodToJsonSchema(groupEntitySchema)),
		},
		systems: {
			schema: merge({}, baseSchema, zodToJsonSchema(systemEntitySchema)),
		},
		containers: {
			schema: merge({}, baseSchema, zodToJsonSchema(containerEntitySchema)),
		},
		relationships: {
			schema: merge({}, baseSchema, zodToJsonSchema(relationshipEntitySchema)),
		},
	});

	return db;
};

export const WorkspaceContext = createContext<WorkspaceDb>(undefined as any);
export const useWorkspaceDb = () => useContext<WorkspaceDb>(WorkspaceContext);
export const WorkspaceProvider = WorkspaceContext.Provider;
