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
import { VscAdd, VscCompass, VscOrganization } from "react-icons/vsc";
import { EntityStatusBadge } from "../components/EntityStatusBadge.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { C4DiagramsPanel } from "../containers/C4DiagramsPanel.tsx";
import { useGroupOperations } from "../hooks/useGroupOperations.ts";
import { deselect, select } from "../hooks/useSelection.ts";
import { WorkspaceGroup } from "../workspace/WorkspaceGroup.ts";

export const GroupPage: FC<{ group: WorkspaceGroup }> = observer(
	({ group }) => {
		const { remove } = useGroupOperations(group);

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
							{ id: group.id, label: group.name },
						]}
					/>
					<NameAndDescription
						id={group.id}
						defaultName={group.name}
						defaultDescription={group.description}
						onNameChange={(name) => group.setName(name)}
						onDescriptionChange={(description) =>
							group.setDescription(description)
						}
						icon={<VscOrganization size={"1.5rem"} />}
						onDelete={remove}
					/>
				</Stack>

				<Tabs
					defaultValue="systems"
					styles={{
						root: { flex: "auto", display: "flex", flexDirection: "column" },
					}}
				>
					<Tabs.List>
						<Tabs.Tab value={"systems"}>Systems</Tabs.Tab>
						<Tabs.Tab value={"c4"}>C4</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value={"systems"} p={"md"}>
						<Group>
							{group.systems.values().map((system) => (
								<Card
									key={system.id}
									shadow={"sm"}
									w={"300px"}
									h={"150px"}
									onClick={() => select(system)}
									styles={{
										root: {
											cursor: "pointer",
										},
									}}
								>
									<Stack style={{ flex: "auto" }} justify={"space-between"}>
										<Stack>
											<Title size={"lg"} fw={"bold"}>
												{system.name}
											</Title>
											<Text size={"xs"}>{system.description}</Text>
										</Stack>
										<EntityStatusBadge status={system.status} />
									</Stack>
								</Card>
							))}
							<ActionIcon onClick={() => group.addNewSystem()}>
								<VscAdd />
							</ActionIcon>
						</Group>
					</Tabs.Panel>

					<C4DiagramsPanel
						key={`${group.id}_c4`}
						ids={group.systems.values().map((it) => it.id)}
						value={"c4"}
					/>
				</Tabs>
			</PageShell>
		);
	},
);
