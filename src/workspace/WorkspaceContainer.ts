import { makeAutoObservable } from "mobx";
import {
	WorkspaceContainerPlugin,
	WorkspaceContainerPluginDto,
} from "./WorkspaceContainerPlugin.ts";
import { WorkspaceSystem } from "./WorkspaceSystem.ts";
import { Repository } from "./repository.ts";
import { ArrayOf } from "./types.ts";

export type WorkspaceContainerDto = {
	id: string;
	name: string;
	description: string;
	technology: string;
	variant: WorkspaceContainerVariant;
	system: string;
	plugins: ArrayOf<WorkspaceContainerPluginDto>;
};

export enum WorkspaceContainerVariant {
	DEFAULT = "default",
	MICROSERVICE = "microservice",
	BROWSER = "browser",
	DATA = "data",
	QUEUE = "queue",
	MOBILE = "mobile",
}

export class WorkspaceContainer {
	readonly id: string;

	name: string;

	description: string;

	technology: string;

	variant: WorkspaceContainerVariant;

	system: WorkspaceSystem;

	plugins: Repository<WorkspaceContainerPlugin>;

	constructor(
		id: string,
		name: string,
		variant: WorkspaceContainerVariant,
		description: string,
		technology: string,
		system: WorkspaceSystem,
		plugins = new Repository([]),
	) {
		makeAutoObservable(this);

		this.id = id;
		this.name = name;
		this.variant = variant;
		this.description = description;
		this.technology = technology;
		this.system = system;
		this.plugins = plugins;
	}

	toDto(): WorkspaceContainerDto {
		return {
			id: this.id,
			name: this.name,
			variant: this.variant,
			description: this.description,
			technology: this.technology,
			system: this.system.id,
			plugins: this.plugins.values().map((it) => it.toDto()),
		};
	}

	static fromDto(dto: WorkspaceContainerDto, system: WorkspaceSystem) {
		const container = new WorkspaceContainer(
			dto.id,
			dto.name,
			dto.variant,
			dto.description,
			dto.technology,
			system,
		);
		const plugins = dto.plugins.map((dto) =>
			WorkspaceContainerPlugin.fromDto(dto, container),
		);
		container.plugins.bulkUpsert(plugins);
		return container;
	}

	setName(name: string) {
		this.name = name;
	}

	setDescription(description: string) {
		this.description = description;
	}

	setVariant(variant: WorkspaceContainerVariant) {
		this.variant = variant;
	}

	setTechnology(technology: string) {
		this.technology = technology;
	}

	addNewPlugin(type: string): WorkspaceContainerPlugin {
		return this.plugins.upsert(
			new WorkspaceContainerPlugin(
				crypto.randomUUID(),
				"Unnamed Plugin",
				type,
				this,
				{},
			),
		);
	}

	removePlugin(id: string) {
		this.plugins.delete(id);
	}

	setSystem(system: WorkspaceSystem) {
		this.system = system;
	}
}
