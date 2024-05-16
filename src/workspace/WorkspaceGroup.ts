import { makeAutoObservable } from "mobx";
import { WorkspaceEntityStatus } from "./WorkspaceEntityStatus.ts";
import {
	WorkspaceSystem,
	WorkspaceSystemDto,
	WorkspaceSystemVariant,
} from "./WorkspaceSystem.ts";
import { Repository } from "./repository.ts";
import { ArrayOf } from "./types.ts";

export type WorkspaceGroupDto = {
	id: string;
	name: string;
	description: string;
	systems: ArrayOf<WorkspaceSystemDto>;
};

export class WorkspaceGroup {
	readonly id: string;

	name: string;

	description: string;

	systems: Repository<WorkspaceSystem>;

	constructor(
		id: string,
		name: string,
		description: string,
		systems = new Repository<WorkspaceSystem>([]),
	) {
		makeAutoObservable(this);

		this.id = id;
		this.name = name;
		this.description = description;
		this.systems = systems;
	}

	toDto(): WorkspaceGroupDto {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			systems: this.systems.values().map((it) => it.toDto()),
		};
	}

	static fromDto(dto: WorkspaceGroupDto) {
		const group = new WorkspaceGroup(dto.id, dto.name, dto.description);
		const systems = dto.systems.map((dto) =>
			WorkspaceSystem.fromDto(dto, group),
		);
		group.systems.bulkUpsert(systems);
		return group;
	}

	setName(name: string) {
		this.name = name;
	}

	setDescription(description: string) {
		this.description = description;
	}

	addNewSystem(): WorkspaceSystem {
		return this.systems.upsert(
			new WorkspaceSystem(
				crypto.randomUUID(),
				WorkspaceSystemVariant.INTERNAL,
				"System name",
				"Description of the software system.",
				WorkspaceEntityStatus.ACTIVE,
				this,
			),
		);
	}

	removeSystem(id: string) {
		this.systems.delete(id);
	}
}
