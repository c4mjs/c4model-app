export type WorkspaceEntity = {
	id: string;
};

export type NamedEntity = WorkspaceEntity & {
	name: string;
};
