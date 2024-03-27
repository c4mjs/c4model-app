import { Badge } from "@mantine/core";
import React from "react";
import { config } from "../config.ts";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";
import { EntityStatusIcon } from "./EntityStatusIcon.tsx";

export type EntityStatusBadgeProps = {
	status: WorkspaceEntityStatus;
};
export const EntityStatusBadge: React.FC<EntityStatusBadgeProps> = ({
	status,
}) => {
	return (
		<Badge
			leftSection={<EntityStatusIcon status={status} />}
			color={config.entityStatusColors[status]}
			variant={"light"}
		>
			{status}
		</Badge>
	);
};
