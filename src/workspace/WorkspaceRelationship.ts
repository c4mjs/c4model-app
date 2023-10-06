import { makeAutoObservable } from "mobx";
import { Workspace } from "./Workspace.ts";
import { WorkspaceContainer } from "./WorkspaceContainer.ts";

export type WorkspaceRelationshipDto = {
	id: string;
	sender: string;
	receiver: string;
	description: string;
	technology: string;
};

export class WorkspaceRelationship {
	readonly id: string;

	sender: WorkspaceContainer;

	receiver: WorkspaceContainer;

	description: string;

	technology: string;

	constructor(
		id: string,
		sender: WorkspaceContainer,
		receiver: WorkspaceContainer,
		description: string,
		technology: string,
	) {
		makeAutoObservable(this);

		this.id = id;
		this.sender = sender;
		this.receiver = receiver;
		this.description = description;
		this.technology = technology;
	}

	toDto(): WorkspaceRelationshipDto {
		return {
			id: this.id,
			description: this.description,
			technology: this.technology,
			sender: this.sender.id,
			receiver: this.receiver.id,
		};
	}

	static fromDto(dto: WorkspaceRelationshipDto, workspace: Workspace) {
		return new WorkspaceRelationship(
			dto.id,
			workspace.getContainer(dto.sender),
			workspace.getContainer(dto.receiver),
			dto.description,
			dto.technology,
		);
	}

	setSender(sender: WorkspaceContainer) {
		this.sender = sender;
	}

	setReceiver(receiver: WorkspaceContainer) {
		this.receiver = receiver;
	}

	setDescription(description: string) {
		this.description = description;
	}

	setTechnology(technology: string) {
		this.technology = technology;
	}
}
