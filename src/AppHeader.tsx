import {
	ActionIcon,
	Divider,
	Group,
	Menu,
	TextInput,
	Tooltip,
	useMantineColorScheme,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import {
	MdOutlineDarkMode,
	MdOutlineLightMode,
	MdSearch,
} from "react-icons/md";
import { VscThreeBars } from "react-icons/vsc";
import { match } from "ts-pattern";
import brandDark from "./assets/brand-dark.svg";
import brandLight from "./assets/brand-light.svg";

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
	id: string;
	name: string;
	onNameChange: (name: string) => void;
	onNew: () => void;
	onOpen: () => void;
	onSave: () => void;
	onSaveAs: () => void;
	onClose: () => void;
	onSpotlight: () => void;
};
export const AppHeader: React.FC<AppHeaderProps> = observer(
	({
		id,
		name,
		onNameChange,
		onNew,
		onOpen,
		onSave,
		onSaveAs,
		onClose,
		onSpotlight,
	}) => {
		const { toggleColorScheme, colorScheme } = useMantineColorScheme();

		const menu: MenuPart[] = [
			{ id: crypto.randomUUID(), type: "item", label: "New", onClick: onNew },
			{
				id: crypto.randomUUID(),
				type: "item",
				label: "Open",
				onClick: onOpen,
			},
			{ id: crypto.randomUUID(), type: "divider" },
			{
				id: crypto.randomUUID(),
				type: "item",
				label: "Save",
				onClick: onSave,
			},
			{
				id: crypto.randomUUID(),
				type: "item",
				label: "Save As..",
				onClick: onSaveAs,
			},
			{ id: crypto.randomUUID(), type: "divider" },
			{
				id: crypto.randomUUID(),
				type: "item",
				label: "Close",
				onClick: onClose,
			},
		];

		const actions = [
			{
				id: crypto.randomUUID(),
				onClick: onSpotlight,
				icon: MdSearch,
				tooltip: "Spotlight Search",
			},
			{
				id: crypto.randomUUID(),
				onClick: toggleColorScheme,
				icon: colorScheme === "dark" ? MdOutlineLightMode : MdOutlineDarkMode,
				tooltip: "Toggle Theme",
			},
		];

		return (
			<Group
				align={"center"}
				justify={"space-between"}
				w={"100%"}
				styles={{ root: { overflow: "visible" } }}
				pr={"sm"}
				pl={"sm"}
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
					<TextInput
						key={id}
						size={"lg"}
						styles={{ input: { fontWeight: 700 } }}
						variant={"unstyled"}
						defaultValue={name}
						onBlur={(e) => onNameChange(e.target.value)}
					/>
				</Group>
				<Group>
					<img
						src={colorScheme === "dark" ? brandDark : brandLight}
						alt={"logo"}
						height={20}
					/>
					<Divider orientation={"vertical"} />
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
	},
);
