import { Drawer, TextInput } from "@mantine/core";
import React, { ReactNode } from "react";

export type PluginDrawerProps = {
	opened: boolean;
	onClose: () => void;
	name: string;
	onNameChange: (name: string) => void;
	children: ReactNode;
};
export const PluginDrawer: React.FC<PluginDrawerProps> = ({
	opened,
	onClose,
	name,
	onNameChange,
	children,
}) => {
	return (
		<Drawer
			opened={opened}
			onClose={onClose}
			size={"xl"}
			position={"right"}
			title={
				<TextInput
					fw={"bold"}
					size={"lg"}
					variant={"unstyled"}
					defaultValue={name}
					onBlur={(e) => onNameChange(e.target.value)}
				/>
			}
		>
			{children}
		</Drawer>
	);
};
