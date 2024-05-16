import { Badge, BadgeProps } from "@mantine/core";
import React from "react";
import { config } from "../config.ts";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";
import { EntityStatusIcon } from "./EntityStatusIcon.tsx";

export type EntityStatusBadgeProps = BadgeProps & {
	status: WorkspaceEntityStatus;
};
export const EntityStatusBadge: React.FC<EntityStatusBadgeProps> = ({
	status,
	...props
}) => {
	return (
		<Badge
			leftSection={<EntityStatusIcon status={status} />}
			color={config.entityStatusColors[status]}
			{...props}
		>
			{status}
		</Badge>
	);
};
