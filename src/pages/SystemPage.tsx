import {
	ActionIcon,
	Card,
	Group,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { VscAdd, VscCompass, VscLayers } from "react-icons/vsc";
import { ContainerVariantIcon } from "../components/ContainerVariantIcon.tsx";
import { EntityStatusBadge } from "../components/EntityStatusBadge.tsx";
import { EntityStatusMenu } from "../components/EntityStatusMenu.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { config } from "../config.ts";
import { C4DiagramsPanel } from "../containers/C4DiagramsPanel.tsx";
import { deselect, select } from "../hooks/useSelection.ts";
import { useSystemOperations } from "../hooks/useSystemOperations.ts";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";
import { WorkspaceSystem } from "../workspace/WorkspaceSystem.ts";

export const SystemPage: FC<{ system: WorkspaceSystem }> = observer(
	({ system }) => {
		const { move, remove } = useSystemOperations(system);

		return (
			<PageShell>
				<Stack>
					<MyBreadcrumbs
						data={[
							{
								id: "explore",
								label: <VscCompass />,
								onClick: deselect,
							},
							{
								id: system.group.id,
								label: system.group.name,
								onClick: () => select(system.group),
							},
							{ id: system.id, label: system.name },
						]}
					/>
					<NameAndDescription
						id={system.id}
						defaultName={system.name}
						defaultDescription={system.description}
						onNameChange={(name) => system.setName(name)}
						onDescriptionChange={(description) =>
							system.setDescription(description)
						}
						icon={<VscLayers size={"1.5rem"} />}
						onDelete={remove}
						onMove={move}
						withMenu={
							<EntityStatusMenu
								status={system.status}
								onChange={(status) => system.setStatus(status)}
							/>
						}
						color={config.entityStatusColors[system.status]}
					/>
					{system.status === WorkspaceEntityStatus.DEPRECATED && (
						<EntityStatusBadge status={system.status} />
					)}
				</Stack>

				<Tabs
					defaultValue="containers"
					styles={{
						root: {
							flex: "auto",
							display: "flex",
							flexDirection: "column",
						},
					}}
				>
					<Tabs.List>
						<Tabs.Tab value={"containers"}>Containers</Tabs.Tab>
						<Tabs.Tab value={"c4"}>C4</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value={"containers"} p={"md"}>
						<Group>
							{system.containers.values().map((container) => (
								<Card
									key={container.id}
									shadow={"sm"}
									w={"300px"}
									h={"150px"}
									onClick={() => select(container)}
									styles={{ root: { cursor: "pointer" } }}
								>
									<Stack gap={"xs"}>
										<Group>
											<ContainerVariantIcon variant={container.variant} />
											<Title size={"lg"} fw={"bold"}>
												{container.name}
											</Title>
										</Group>
										<Text>{container.technology}</Text>
										<Text size={"xs"}>{container.description}</Text>
									</Stack>
								</Card>
							))}
							<ActionIcon onClick={() => system.addNewContainer()}>
								<VscAdd />
							</ActionIcon>
						</Group>
					</Tabs.Panel>

					<C4DiagramsPanel
						key={`${system.id}_c4`}
						ids={[system.id]}
						value={"c4"}
					/>
				</Tabs>
			</PageShell>
		);
	},
);
