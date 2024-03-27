import { ActionIcon, Card, Group, Stack, Tabs, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { VscAdd, VscCompass } from "react-icons/vsc";
import { ContainerVariantIcon } from "../components/ContainerVariantIcon.tsx";
import { ContainerVariantMenu } from "../components/ContainerVariantMenu.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { RelationshipsTable } from "../containers/RelationshipsTable.tsx";
import { useContainerOperations } from "../hooks/useContainerOperations.ts";
import { deselect, select } from "../hooks/useSelection.ts";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import { availablePlugins } from "../plugins";
import { PluginTab } from "../plugins/PluginTab.tsx";
import { useWorkspace } from "../workspace/Workspace.ts";
import { WorkspaceContainer } from "../workspace/WorkspaceContainer.ts";

export const ContainerPage: FC<{ container: WorkspaceContainer }> = observer(
	({ container }) => {
		const [tab, setTab] = useState("relationships");

		const workspace = useWorkspace();
		const { move, remove } = useContainerOperations(container);

		const addPlugin = () =>
			container &&
			openSelectModal({
				title: "Add Plugin",
				selectProps: {
					placeholder: "Plugin",
					data: availablePlugins.map((it) => ({
						value: it.type,
						label: it.label,
					})),
					searchable: true,
				},
				labels: { confirm: "Add", cancel: "Cancel" },
				onCancel: modals.closeAll,
				onConfirm: async (type) => {
					container.addNewPlugin(type);
					modals.closeAll();
				},
			});

		const handleRemovePlugin = async (id: string) => {
			container.removePlugin(id);
			setTab("relationships");
		};

		return (
			<PageShell>
				<MyBreadcrumbs
					data={[
						{
							id: "explore",
							label: <VscCompass />,
							onClick: () => deselect(),
						},
						{
							id: container.system.group.id,
							label: container.system.group.name,
							onClick: () => select(container.system.group),
						},
						{
							id: container.system.id,
							label: container.system.name,
							onClick: () => select(container.system),
						},
						{ id: container.id, label: container.name },
					]}
				/>
				<NameAndDescription
					id={container.id}
					defaultName={container.name}
					defaultDescription={container.description}
					onNameChange={(name) => container.setName(name)}
					onDescriptionChange={(description) =>
						container.setDescription(description)
					}
					icon={
						<ContainerVariantIcon variant={container.variant} size={"1.5rem"} />
					}
					onDelete={remove}
					onMove={move}
					withMenu={
						<ContainerVariantMenu
							variant={container.variant}
							onChange={(variant) => container.setVariant(variant)}
						/>
					}
				/>
				<TextInput
					key={container.id}
					label={"Technology"}
					variant={"unstyled"}
					defaultValue={container.technology}
					onBlur={(e) => container.setTechnology(e.target.value || "")}
				/>
				<Tabs value={tab} onChange={(it) => it && it !== "add" && setTab(it)}>
					<Tabs.List>
						<Tabs.Tab value="relationships">Relationships</Tabs.Tab>
						{container.plugins.values().map((plugin) => (
							<Tabs.Tab key={plugin.id} value={plugin.id}>
								{plugin.name}
							</Tabs.Tab>
						))}
						<Tabs.Tab value="add" leftSection={<VscAdd />} onClick={addPlugin}>
							Add
						</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value={"relationships"} p={"md"}>
						<Card shadow={"sm"}>
							<Stack>
								<Group justify={"end"}>
									<ActionIcon
										onClick={() =>
											workspace.addNewRelationship(container, container)
										}
									>
										<VscAdd />
									</ActionIcon>
								</Group>
								<RelationshipsTable
									relationships={workspace.getApplicableRelationships(
										container,
									)}
									onRowDelete={(id) => workspace.removeRelationship(id)}
									relationshipOptions={workspace.systems.map((s) => ({
										group: s.name,
										items: s.containers
											.values()
											.map((c) => ({ value: c.id, label: c.name })),
									}))}
									containerResolver={(id) => workspace.getContainer(id)}
								/>
							</Stack>
						</Card>
					</Tabs.Panel>
					{container.plugins.values().map((plugin) => (
						<PluginTab
							key={plugin.id}
							plugin={plugin}
							onDelete={() => handleRemovePlugin(plugin.id)}
						/>
					))}
				</Tabs>
			</PageShell>
		);
	},
);
