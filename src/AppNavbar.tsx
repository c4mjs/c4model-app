import {
	ActionIcon,
	Button,
	ButtonProps,
	Collapse,
	Divider,
	Group,
	ScrollArea,
	Stack,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isUndefined } from "lodash";
import { observer } from "mobx-react-lite";
import { FC, ReactNode, useRef } from "react";
import {
	VscAdd,
	VscChevronDown,
	VscChevronRight,
	VscCompass,
	VscLayers,
	VscOrganization,
} from "react-icons/vsc";
import { ContainerVariantIcon } from "./components/ContainerVariantIcon.tsx";
import { config } from "./config.ts";
import { deselect, select, useSelection } from "./hooks/useSelection.ts";
import { useWorkspace } from "./workspace/Workspace.ts";

export type NavButtonProps = {
	buttonProps?: ButtonProps;
	withCollapse?: boolean;
	defaultOpened?: boolean;
	children?: ReactNode;
	label: ReactNode;
	leftSection?: ReactNode;
	onClick?: () => void;
};
export const NavButton: FC<NavButtonProps> = ({
	withCollapse,
	label,
	defaultOpened,
	children,
	leftSection,
	onClick,
	buttonProps,
}) => {
	const [opened, collapse] = useDisclosure(
		defaultOpened || isUndefined(withCollapse),
	);

	return (
		<Stack gap={0}>
			<Group justify={"space-between"} gap={0} wrap={"nowrap"}>
				<Button
					variant={"transparent"}
					onClick={onClick}
					leftSection={leftSection}
					fullWidth
					justify={"start"}
					{...buttonProps}
				>
					{label}
				</Button>
				{children && withCollapse && (
					<ActionIcon variant={"subtle"} onClick={collapse.toggle}>
						{opened ? <VscChevronDown /> : <VscChevronRight />}
					</ActionIcon>
				)}
			</Group>
			{children && (
				<Collapse in={opened} pl={"lg"}>
					{children}
				</Collapse>
			)}
		</Stack>
	);
};

export const AppNavbar: FC = observer(() => {
	const { colors } = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const scrollParent = useRef<HTMLDivElement | null>(null);
	const selection = useSelection();
	const workspace = useWorkspace();

	return (
		<Stack
			gap={0}
			justify={"space-between"}
			styles={{
				root: {
					flex: "auto",
					display: "flex",
					width: config.navbar.width,
				},
			}}
		>
			<Stack styles={{ root: { flex: "auto" } }}>
				<Stack pl={"xs"} pt={"xs"} pr={"xs"}>
					<NavButton
						leftSection={<VscCompass />}
						label={
							<Text fw={isUndefined(selection) ? "bold" : undefined}>Home</Text>
						}
						onClick={deselect}
					/>
					<Divider />
					<Group justify={"space-between"}>
						<Text fw={"bold"} c="dimmed">
							Groups
						</Text>
						<ActionIcon
							variant={"subtle"}
							onClick={() => workspace.addNewGroup()}
						>
							<VscAdd />
						</ActionIcon>
					</Group>
				</Stack>
				<Stack ref={scrollParent} styles={{ root: { flex: "auto" } }}>
					<ScrollArea h={scrollParent.current?.clientHeight}>
						<Stack
							pl={"xs"}
							gap={"xs"}
							styles={{
								root: { width: config.navbar.width - 20, overflow: "hidden" },
							}}
						>
							{workspace.groups.values().map((group) => (
								<NavButton
									buttonProps={{
										w: config.navbar.width - 60,
									}}
									withCollapse
									leftSection={<VscOrganization />}
									defaultOpened={true}
									key={group.id}
									label={
										<Text
											fw={selection === group ? "bold" : undefined}
											styles={{
												root: {
													overflow: "hidden",
													textOverflow: "ellipsis",
													wordBreak: "break-all",
												},
											}}
										>
											{group.name}
										</Text>
									}
									onClick={() => select(group)}
								>
									<Stack
										gap={0}
										styles={{
											root: {
												borderLeft: "solid 1px",
												borderLeftColor: colors.dark[0],
											},
										}}
									>
										{workspace.systems
											.filter((it) => it.group.id === group.id)
											.map((system) => (
												<NavButton
													leftSection={<VscLayers />}
													key={system.id}
													label={
														<Text
															fw={selection === system ? "bold" : undefined}
															size={"xs"}
															styles={{
																root: {
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																	wordBreak: "break-all",
																},
															}}
														>
															{system.name}
														</Text>
													}
													onClick={() => select(system)}
												>
													{workspace.containers
														.filter((it) => it.system.id === system.id)
														.map((container) => (
															<NavButton
																buttonProps={{
																	size: "compact-md",
																	variant: "transparent",
																	color:
																		colors.gray[colorScheme === "dark" ? 4 : 7],
																}}
																onClick={() => select(container)}
																key={container.id}
																leftSection={
																	<ContainerVariantIcon
																		variant={container.variant}
																	/>
																}
																label={
																	<Text
																		fw={
																			selection === container
																				? "bold"
																				: undefined
																		}
																		size={"xs"}
																		styles={{
																			root: {
																				overflow: "hidden",
																				textOverflow: "ellipsis",
																				wordBreak: "break-all",
																			},
																		}}
																	>
																		{container.name}
																	</Text>
																}
															/>
														))}
												</NavButton>
											))}
									</Stack>
								</NavButton>
							))}
						</Stack>
					</ScrollArea>
				</Stack>
			</Stack>
		</Stack>
	);
});
