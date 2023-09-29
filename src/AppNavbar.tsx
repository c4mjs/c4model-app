import { Divider, NavLink, ScrollArea, Stack, Text } from "@mantine/core";
import { isEmpty } from "lodash";
import { FC, useRef } from "react";
import { VscAdd } from "react-icons/vsc";
import { useObservable } from "react-use";
import { ContainerVariantIcon } from "./components/ContainerVariantIcon.tsx";
import { select, useSelection } from "./hooks/useSelection.ts";
import {
	getNewGroupEntity,
	useWorkspaceDb,
} from "./workspaces/workspace-db.ts";

export const AppNavbar: FC = () => {
	const db = useWorkspaceDb();
	const selection = useSelection();
	const scrollParent = useRef<HTMLDivElement | null>(null);

	const groups = useObservable(
		db?.collections.groups.find({ sort: [{ name: "asc" }] }).$,
		[],
	);

	const systems = useObservable(
		db?.collections.systems.find({ sort: [{ name: "asc" }] }).$,
		[],
	);

	const containers = useObservable(
		db?.containers.find({ sort: [{ name: "asc" }] }).$,
		[],
	);

	return (
		<Stack
			gap={0}
			justify={"space-between"}
			styles={{
				root: {
					flex: "auto",
					justifyContent: "space-between",
					display: "flex",
				},
			}}
		>
			<Stack gap={0} ref={scrollParent} styles={{ root: { flex: "auto" } }}>
				<ScrollArea mah={scrollParent.current?.clientHeight}>
					{groups.map((group) => (
						<NavLink
							defaultOpened
							key={group.id}
							id={group.id}
							label={
								<Text size={"sm"} styles={{ root: { fontWeight: "600" } }}>
									{group.name}
								</Text>
							}
							onClick={() => select(group)}
							active={selection === group}
						>
							{isEmpty(systems?.filter((it) => it.group === group.id))
								? undefined
								: systems
										?.filter((it) => it.group === group.id)
										.map((system) => (
											<NavLink
												key={system.id}
												label={<Text size={"sm"}>{system.name}</Text>}
												onClick={() => select(system)}
												active={selection === system}
												children={
													isEmpty(
														containers.filter((it) => it.system === system.id),
													)
														? undefined
														: containers
																.filter((it) => it.system === system.id)
																.map((container) => (
																	<NavLink
																		leftSection={
																			<ContainerVariantIcon
																				variant={container.variant}
																			/>
																		}
																		key={container.id}
																		label={
																			<Text size={"xs"}>{container.name}</Text>
																		}
																		onClick={() => select(container)}
																		active={selection === container}
																	/>
																))
												}
											/>
										))}
						</NavLink>
					))}
				</ScrollArea>
			</Stack>
			<Stack gap={0}>
				<Divider />
				<NavLink
					leftSection={<VscAdd />}
					label={"Add"}
					onClick={async () =>
						db.collections.groups.insert(getNewGroupEntity())
					}
				/>
			</Stack>
		</Stack>
	);
};
