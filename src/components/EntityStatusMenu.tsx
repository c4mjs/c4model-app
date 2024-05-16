import { Menu, Text } from "@mantine/core";
import { map } from "lodash";
import React from "react";
import { config } from "../config.ts";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";
import { EntityStatusIcon } from "./EntityStatusIcon.tsx";

const statusOptions: Record<WorkspaceEntityStatus, string> = {
	[WorkspaceEntityStatus.ACTIVE]: "Active",
	[WorkspaceEntityStatus.TARGET]: "Target",
	[WorkspaceEntityStatus.DEPRECATED]: "Deprecated",
	[WorkspaceEntityStatus.INACTIVE]: "Inactive",
};

export type SystemStatusProps = {
	status: WorkspaceEntityStatus;
	onChange: (status: WorkspaceEntityStatus) => void;
};
export const EntityStatusMenu: React.FC<SystemStatusProps> = ({
	status,
	onChange,
}) => {
	return (
		<>
			<Menu.Label>Status</Menu.Label>
			{map(statusOptions, (v, k) => (
				<Menu.Item
					color={config.entityStatusColors[k as WorkspaceEntityStatus]}
					leftSection={<EntityStatusIcon status={k as WorkspaceEntityStatus} />}
					onClick={() => onChange(k as WorkspaceEntityStatus)}
				>
					<Text fw={status === k ? "bold" : undefined}>{v}</Text>
				</Menu.Item>
			))}
			<Menu.Divider />
		</>
	);
};
