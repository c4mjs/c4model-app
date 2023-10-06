import { makeAutoObservable } from "mobx";
import { WorkspaceContainer } from "./WorkspaceContainer.ts";

export type WorkspaceContainerPluginDto = {
	id: string;
	type: string;
	container: string;
	name: string;
	data: Record<string, any>;
};

export class WorkspaceContainerPlugin {
	readonly id: string;

	readonly type: string;

	readonly container: WorkspaceContainer;

	name: string;

	data: Record<string, any>;

	constructor(
		id: string,
		name: string,
		type: string,
		container: WorkspaceContainer,
		data: Record<string, any>,
	) {
		makeAutoObservable(this);

		this.id = id;
		this.name = name;
		this.type = type;
		this.container = container;
		this.data = data;
	}

	toDto(): WorkspaceContainerPluginDto {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			container: this.container.id,
			data: this.data,
		};
	}

	static fromDto(
		dto: WorkspaceContainerPluginDto,
		container: WorkspaceContainer,
	) {
		return new WorkspaceContainerPlugin(
			dto.id,
			dto.name,
			dto.type,
			container,
			dto.data,
		);
	}

	setName(name: string) {
		this.name = name;
	}

	setData(data: Record<string, any>) {
		this.data = data;
	}
}
