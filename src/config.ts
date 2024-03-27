import { WorkspaceEntityStatus } from "./workspace/WorkspaceEntityStatus.ts";

export const config: {
	header: {
		height: number;
	};
	navbar: {
		width: number;
	};
	entityStatusColors: Record<WorkspaceEntityStatus, string>;
} = {
	header: {
		height: 60,
	},
	navbar: {
		width: 300,
	},
	entityStatusColors: {
		[WorkspaceEntityStatus.ACTIVE]: "green",
		[WorkspaceEntityStatus.INACTIVE]: "orange",
		[WorkspaceEntityStatus.DEPRECATED]: "red",
		[WorkspaceEntityStatus.TARGET]: "blue",
	},
};
