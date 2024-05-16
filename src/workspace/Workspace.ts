import { uniq } from "lodash";
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import { WorkspaceContainer } from "./WorkspaceContainer.ts";
import { WorkspaceGroup, WorkspaceGroupDto } from "./WorkspaceGroup.ts";
import {
	WorkspaceRelationship,
	WorkspaceRelationshipDto,
} from "./WorkspaceRelationship.ts";
import { WorkspaceSystem } from "./WorkspaceSystem.ts";
import { Repository } from "./repository.ts";
import { ArrayOf } from "./types.ts";

export type WorkspaceDto = {
	id: string;

	version: string;

	name: string;

	groups: ArrayOf<WorkspaceGroupDto>;

	relationships: ArrayOf<WorkspaceRelationshipDto>;
};

export class Workspace {
	id: string;

	version: string;

	name: string;

	groups: Repository<WorkspaceGroup>;

	relationships: Repository<WorkspaceRelationship>;

	explorerFilters: string[];

	explorerLabels: string[];

	get systems(): WorkspaceSystem[] {
		return this.groups.values().flatMap((it) => it.systems.values());
	}

	get containers(): WorkspaceContainer[] {
		return this.groups
			.values()
			.flatMap((g) => g.systems.values().flatMap((s) => s.containers.values()));
	}

	get labels(): string[] {
		return uniq(this.relationships.values().flatMap((it) => it.labels));
	}

	constructor(
		id: string,
		version: string,
		name: string,
		groups = new Repository<WorkspaceGroup>([]),
		relationships = new Repository<WorkspaceRelationship>([]),
	) {
		makeAutoObservable(this);
		this.id = id;
		this.version = version;
		this.name = name;
		this.groups = groups;
		this.relationships = relationships;
		this.explorerFilters = [];
		this.explorerLabels = [];
	}

	toDto(): WorkspaceDto {
		return {
			id: this.id,
			name: this.name,
			version: this.version,
			groups: this.groups.values().map((it) => it.toDto()),
			relationships: this.relationships.values().map((it) => it.toDto()),
		};
	}

	static fromDto(dto: WorkspaceDto) {
		const workspace = new Workspace(dto.id, dto.version, dto.name);

		const groups = dto.groups.map((dto) => WorkspaceGroup.fromDto(dto));
		workspace.groups.bulkUpsert(groups);

		const relationships = dto.relationships.map((dto) =>
			WorkspaceRelationship.fromDto(dto, workspace),
		);
		workspace.relationships.bulkUpsert(relationships);

		return workspace;
	}

	setName(name: string) {
		this.name = name;
	}

	addNewGroup(): WorkspaceGroup {
		return this.groups.upsert(
			new WorkspaceGroup(
				crypto.randomUUID(),
				"Group name",
				"Description of the group.",
			),
		);
	}

	removeGroup(id: string) {
		const group = this.groups.safeGet(id);
		group.systems.values().forEach((system) => this.removeSystem(system.id));
		this.groups.delete(group.id);
	}

	removeSystem(id: string) {
		const system = this.systems.find((it) => it.id === id);
		if (!system) return;
		const group = system.group;
		this.removeRelationships(
			this.getApplicableSystemRelationships(system).map((it) => it.id),
		);
		group.systems.delete(system.id);
	}

	getSystem(id: string): WorkspaceSystem {
		const system = this.systems.find((it) => it.id === id);
		if (!system) {
			throw new Error(`Unable to locate system ${id} in the workspace`);
		}
		return system;
	}

	moveSystem(id: string, groupId: string) {
		const system = this.systems.find((it) => it.id === id);
		if (!system) return;
		const currentGroup = system.group;
		const newGoup = this.groups.safeGet(groupId);
		system.setGroup(newGoup);
		newGoup.systems.upsert(system);
		currentGroup.systems.delete(system.id);
	}

	addNewRelationship(
		sender: WorkspaceContainer,
		receiver: WorkspaceContainer,
	): WorkspaceRelationship {
		return this.relationships.upsert(
			new WorkspaceRelationship(
				crypto.randomUUID(),
				sender,
				receiver,
				"e.g. Makes API calls",
				"e.g. JSON/HTTP",
				[],
			),
		);
	}

	removeRelationship(id: string) {
		this.relationships.delete(id);
	}

	removeRelationships(ids: string[]) {
		this.relationships.deleteAll(ids);
	}

	getApplicableRelationships(container: WorkspaceContainer) {
		return this.relationships
			.values()
			.filter((it) => [it.sender.id, it.receiver.id].includes(container.id));
	}

	getApplicableSystemRelationships(system: WorkspaceSystem) {
		return system.containers
			.values()
			.flatMap((it) => this.getApplicableRelationships(it));
	}

	getContainer(id: string): WorkspaceContainer {
		const container = this.containers.find((it) => it.id === id);
		if (!container) {
			throw new Error(`Unable to locate container ${id} in the workspace`);
		}
		return container;
	}

	removeContainer(id: string) {
		const container = this.containers.find((it) => it.id === id);
		if (!container) return;
		const system = container.system;
		this.removeRelationships(
			this.getApplicableRelationships(container).map((it) => it.id),
		);
		system.containers.delete(container.id);
	}

	moveContainer(id: string, systemId: string) {
		const container = this.containers.find((it) => it.id === id);
		const newSystem = this.systems.find((it) => it.id === systemId);

		if (!container || !newSystem)
			throw new Error("Container or new system not found");

		console.log(`Moving ${container.name} to ${newSystem.name}`);

		const currentSystem = container.system;
		container.setSystem(newSystem);
		newSystem.containers.upsert(container);
		currentSystem.containers.delete(container.id);
	}

	setExplorerFilters(filters: string[]) {
		this.explorerFilters = filters;
	}

	setExplorerLabels(labels: string[]) {
		this.explorerLabels = labels;
	}
}

export const WorkspaceContext = createContext<Workspace>(undefined as any);
export const useWorkspace = () => useContext<Workspace>(WorkspaceContext);
export const WorkspaceProvider = WorkspaceContext.Provider;
