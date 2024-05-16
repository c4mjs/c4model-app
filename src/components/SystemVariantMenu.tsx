import { Menu, Text } from "@mantine/core";
import { map } from "lodash";
import React from "react";
import { WorkspaceSystemVariant } from "../workspace/WorkspaceSystem.ts";

const options: Record<WorkspaceSystemVariant, string> = {
	[WorkspaceSystemVariant.INTERNAL]: "Internal",
	[WorkspaceSystemVariant.EXTERNAL]: "External",
};

export type SystemVariantMenuProps = {
	variant: WorkspaceSystemVariant;
	onChange: (variant: WorkspaceSystemVariant) => void;
};
export const SystemVariantMenu: React.FC<SystemVariantMenuProps> = ({
	variant,
	onChange,
}) => {
	return (
		<>
			<Menu.Label>Variant</Menu.Label>
			{map(options, (v, k) => (
				<Menu.Item onClick={() => onChange(k as WorkspaceSystemVariant)}>
					<Text fw={variant === k ? "bold" : undefined}>{v}</Text>
				</Menu.Item>
			))}
			<Menu.Divider />
		</>
	);
};
