import { Menu, Text } from "@mantine/core";
import { map } from "lodash";
import { FC } from "react";
import { ContainerEntity } from "../workspaces/workspace-db.ts";
import { ContainerVariantIcon } from "./ContainerVariantIcon.tsx";

export type ContainerVariantSelectProps = {
	variant: ContainerEntity["variant"];
	onChange: (variant: ContainerEntity["variant"]) => void;
};

const variantOptions: Record<ContainerEntity["variant"], string> = {
	default: "Default",
	data: "Data",
	microservice: "Microservice",
	queue: "Queue",
	browser: "Browser",
	mobile: "Mobile",
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
						<ContainerVariantIcon variant={k as ContainerEntity["variant"]} />
					}
					onClick={() => onChange(k as ContainerEntity["variant"])}
				>
					<Text
						styles={{ root: { fontWeight: variant === k ? 700 : undefined } }}
					>
						{v}
					</Text>
				</Menu.Item>
			))}
			<Menu.Divider />
		</>
	);
};
