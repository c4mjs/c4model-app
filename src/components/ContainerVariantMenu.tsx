import { Menu, Text } from "@mantine/core";
import { map } from "lodash";
import { FC } from "react";
import { WorkspaceContainerVariant } from "../workspace/WorkspaceContainer.ts";
import { ContainerVariantIcon } from "./ContainerVariantIcon.tsx";

export type ContainerVariantSelectProps = {
	variant: WorkspaceContainerVariant;
	onChange: (variant: WorkspaceContainerVariant) => void;
};

const variantOptions: Record<WorkspaceContainerVariant, string> = {
	[WorkspaceContainerVariant.DEFAULT]: "Default",
	[WorkspaceContainerVariant.DATA]: "Data",
	[WorkspaceContainerVariant.MICROSERVICE]: "Microservice",
	[WorkspaceContainerVariant.QUEUE]: "Queue",
	[WorkspaceContainerVariant.BROWSER]: "Browser",
	[WorkspaceContainerVariant.MOBILE]: "Mobile",
};

export const ContainerVariantMenu: FC<ContainerVariantSelectProps> = ({
	variant,
	onChange,
}) => {
	return (
		<>
			<Menu.Label>Container Type</Menu.Label>
			{map(variantOptions, (v, k) => (
				<Menu.Item
					leftSection={
						<ContainerVariantIcon variant={k as WorkspaceContainerVariant} />
					}
					onClick={() => onChange(k as WorkspaceContainerVariant)}
				>
					<Text fw={variant === k ? "bold" : undefined}>{v}</Text>
				</Menu.Item>
			))}
			<Menu.Divider />
		</>
	);
};
