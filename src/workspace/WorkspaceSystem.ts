import { makeAutoObservable } from "mobx";
import {
	WorkspaceContainer,
	WorkspaceContainerDto,
	WorkspaceContainerVariant,
} from "./WorkspaceContainer.ts";
import { WorkspaceGroup } from "./WorkspaceGroup.ts";
import { Repository } from "./repository.ts";
import { ArrayOf } from "./types.ts";

export type WorkspaceSystemDto = {
	id: string;
	name: string;
	description: string;
	group: string;
	containers: ArrayOf<WorkspaceContainerDto>;
};

export class WorkspaceSystem {
	readonly id: string;

	name: string;

	description: string;

	group: WorkspaceGroup;

	containers: Repository<WorkspaceContainer>;

	constructor(
		id: string,
		name: string,
		description: string,
		group: WorkspaceGroup,
		containers = new Repository([]),
	) {
		makeAutoObservable(this);

		this.id = id;
		this.name = name;
		this.description = description;
		this.group = group;
		this.containers = containers;
	}

	toDto(): WorkspaceSystemDto {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			group: this.group.id,
			containers: this.containers.values().map((it) => it.toDto()),
		};
	}

	static fromDto(dto: WorkspaceSystemDto, group: WorkspaceGroup) {
		const system = new WorkspaceSystem(
			dto.id,
			dto.name,
			dto.description,
			group,
		);
		const containers = dto.containers.map((dto) =>
			WorkspaceContainer.fromDto(dto, system),
		);
		system.containers.bulkUpsert(containers);
		return system;
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
