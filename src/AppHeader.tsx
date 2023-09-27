import {
	ActionIcon,
	Group,
	Menu,
	Title,
	Tooltip,
	useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { VscThreeBars } from "react-icons/vsc";

export type AppHeaderProps = {
	onNew: () => void;
	onOpen: () => void;
	onSave: () => void;
	onClose: () => void;
};
export const AppHeader: React.FC<AppHeaderProps> = ({
	onNew,
	onOpen,
	onSave,
	onClose,
}) => {
	const { toggleColorScheme, colorScheme } = useMantineColorScheme();

	const menu = [
		{ type: "item", label: "New", onClick: onNew },
		{ type: "item", label: "Open", onClick: onOpen },
		{ type: "divider" },
		{ type: "item", label: "Save", onClick: onSave },
		{ type: "divider" },
		{ type: "item", label: "Close", onClick: onClose },
	];

	const actions = [
		{
			onClick: toggleColorScheme,
			icon: colorScheme === "dark" ? MdOutlineLightMode : MdOutlineDarkMode,
			tooltip: "Toggle Theme",
		},
	];

	return (
		<Group
			pl={"xs"}
			pr={"xs"}
			align={"center"}
			justify={"space-between"}
			w={"100%"}
			styles={{ root: { overflow: "visible" } }}
		>
			<Group>
				<Menu position="bottom-start" shadow={"md"} width={200}>
					<Menu.Target>
						<ActionIcon variant={"subtle"} size={"lg"}>
							<VscThreeBars size={"1.5rem"} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						{menu.map((it) => (
							<>
								{it.type === "item" && (
									<Menu.Item onClick={it.onClick}>{it.label}</Menu.Item>
								)}
								{it.type === "divider" && <Menu.Divider />}
							</>
						))}
					</Menu.Dropdown>
				</Menu>
				<Title order={3}>C4Model.App</Title>
			</Group>
			<Group>
				{actions.map((it) => (
					<Tooltip label={it.tooltip}>
						<ActionIcon
							variant={"default"}
							size={"lg"}
							radius={"md"}
							onClick={it.onClick}
						>
							<it.icon />
						</ActionIcon>
					</Tooltip>
				))}
			</Group>
		</Group>
	);
};
