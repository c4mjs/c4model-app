import {
	ActionIcon,
	Group,
	Menu,
	Title,
	Tooltip,
	useMantineColorScheme,
} from "@mantine/core";
import React, { FC } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { VscThreeBars } from "react-icons/vsc";
import { match } from "ts-pattern";

type MenuPart = {
	id: string;
	type: "item" | "divider";
	label?: string;
	onClick?: () => void;
};

const GetMenuPart: FC<{ part: MenuPart }> = ({ part }) =>
	match(part.type)
		.with("item", () => (
			<Menu.Item key={part.id} onClick={part.onClick}>
				{part.label}
			</Menu.Item>
		))
		.with("divider", () => <Menu.Divider key={part.id} />)
		.run();

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

	const menu: MenuPart[] = [
		{ id: "menu_a", type: "item", label: "New", onClick: onNew },
		{ id: "menu_b", type: "item", label: "Open", onClick: onOpen },
		{ id: "menu_c", type: "divider" },
		{ id: "menu_d", type: "item", label: "Save", onClick: onSave },
		{ id: "menu_e", type: "divider" },
		{ id: "menu_f", type: "item", label: "Close", onClick: onClose },
	];

	const actions = [
		{
			id: "action_a",
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
						{menu.map((part) => GetMenuPart({ part }))}
					</Menu.Dropdown>
				</Menu>
				<Title order={3}>C4Model.App</Title>
			</Group>
			<Group>
				{actions.map((it) => (
					<Tooltip key={it.id} label={it.tooltip} openDelay={500}>
						<ActionIcon
							key={it.id}
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
