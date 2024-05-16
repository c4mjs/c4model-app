import { makeAutoObservable } from "mobx";
import {
	WorkspaceContainer,
	WorkspaceContainerDto,
	WorkspaceContainerVariant,
} from "./WorkspaceContainer.ts";
import { WorkspaceEntityStatus } from "./WorkspaceEntityStatus.ts";
import { WorkspaceGroup } from "./WorkspaceGroup.ts";
import { Repository } from "./repository.ts";
import { ArrayOf } from "./types.ts";

export enum WorkspaceSystemVariant {
	INTERNAL = "INTERNAL",
	EXTERNAL = "EXTERNAL",
}

export type WorkspaceSystemDto = {
	id: string;
	variant: WorkspaceSystemVariant;
	name: string;
	description: string;
	group: string;
	status?: WorkspaceEntityStatus;
	containers: ArrayOf<WorkspaceContainerDto>;
};

export class WorkspaceSystem {
	readonly id: string;

	variant: WorkspaceSystemVariant;

	name: string;

	description: string;

	status: WorkspaceEntityStatus;

	group: WorkspaceGroup;

	containers: Repository<WorkspaceContainer>;

	constructor(
		id: string,
		variant: WorkspaceSystemVariant,
		name: string,
		description: string,
		status: WorkspaceEntityStatus,
		group: WorkspaceGroup,
		containers = new Repository([]),
	) {
		makeAutoObservable(this);

		this.id = id;
		this.variant = variant;
		this.name = name;
		this.description = description;
		this.status = status;
		this.group = group;
		this.containers = containers;
	}

	toDto(): WorkspaceSystemDto {
		return {
			id: this.id,
			variant: this.variant,
			name: this.name,
			description: this.description,
			status: this.status,
			group: this.group.id,
			containers: this.containers.values().map((it) => it.toDto()),
		};
	}

	static fromDto(dto: WorkspaceSystemDto, group: WorkspaceGroup) {
		const system = new WorkspaceSystem(
			dto.id,
			dto.variant || WorkspaceSystemVariant.INTERNAL,
			dto.name,
			dto.description,
			dto.status || WorkspaceEntityStatus.ACTIVE,
			group,
		);
		const containers = dto.containers.map((dto) =>
			WorkspaceContainer.fromDto(dto, system),
		);
		system.containers.bulkUpsert(containers);
		return system;
	}

	setVariant(variant: WorkspaceSystemVariant) {
		this.variant = variant;
	}

	setName(name: string) {
		this.name = name;
	}

	setDescription(description: string) {
		this.description = description;
	}

	setGroup(group: WorkspaceGroup) {
		this.group = group;
	}

	setStatus(status: WorkspaceEntityStatus) {
		this.status = status;
	}

	addNewContainer(): WorkspaceContainer {
		return this.containers.upsert(
			new WorkspaceContainer(
				crypto.randomUUID(),
				"Container name",
				WorkspaceContainerVariant.DEFAULT,
				"Description of the containers role/responsibility.",
				"e.g. SpringBoot, ElasticSearch, etc.",
				this,
			),
		);
	}
}
