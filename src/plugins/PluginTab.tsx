import { ActionIcon, Alert, Group, Menu, Stack, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import React from "react";
import { VscEllipsis } from "react-icons/vsc";
import { WorkspaceContainerPlugin } from "../workspace/WorkspaceContainerPlugin.ts";
import { pluginsByType } from "./index.ts";

export type PluginProps = {
	plugin: WorkspaceContainerPlugin;
	onDelete: () => void;
};
export const PluginTab: React.FC<PluginProps> = observer(
	({ plugin, onDelete }) => {
		const Component = plugin && pluginsByType[plugin.type].component;
		const [editingPlugin, editPlugin] = useDisclosure();

		return (
			<Tabs.Panel value={plugin.id}>
				{plugin && (
					<Stack styles={{ root: { position: "relative" } }}>
						<Group
							gap={"xs"}
							p={"xs"}
							justify={"end"}
							styles={{
								root: { position: "absolute", top: 0, right: 0, zIndex: 100 },
							}}
						>
							<Menu position="bottom-start" shadow={"md"} width={200}>
								<Menu.Target>
									<ActionIcon variant={"default"}>
										<VscEllipsis style={{ transform: "rotate(90deg)" }} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item onClick={editPlugin.open}>Edit</Menu.Item>
									{onDelete && <Menu.Item onClick={onDelete}>Delete</Menu.Item>}
								</Menu.Dropdown>
							</Menu>
						</Group>
						{Component && (
							<Component
								key={plugin.id}
								name={plugin.name}
								onNameChange={(name) => plugin.setName(name)}
								data={plugin.data}
								onDataChange={(data) => plugin.setData(data)}
								editing={editingPlugin}
								onCloseEditing={editPlugin.close}
							/>
						)}
						{!Component && <Alert>Plugin not found</Alert>}
					</Stack>
				)}
			</Tabs.Panel>
		);
	},
);
