import {
	ActionIcon,
	ComboboxData,
	Menu,
	Select,
	Table,
	TextInput,
} from "@mantine/core";
import { FC } from "react";
import { VscEllipsis } from "react-icons/vsc";
import { WorkspaceContainer } from "../workspace/WorkspaceContainer.ts";
import { WorkspaceRelationship } from "../workspace/WorkspaceRelationship.ts";

export type RelationshipsTableProps = {
	relationships: WorkspaceRelationship[];
	onRowDelete: (id: string) => void;
	relationshipOptions: ComboboxData;
	containerResolver: (id: string) => WorkspaceContainer;
};

export const RelationshipsTable: FC<RelationshipsTableProps> = ({
	relationships,
	onRowDelete,
	relationshipOptions,
	containerResolver,
}) => {
	return (
		<Table highlightOnHover>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Sender</Table.Th>
					<Table.Th>Receiver</Table.Th>
					<Table.Th>Description</Table.Th>
					<Table.Th>Technology</Table.Th>
					<Table.Th>Actions</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{relationships.map((relationship) => (
					<Table.Tr key={relationship.id}>
						<Table.Td>
							{
								<Select
									variant={"unstyled"}
									searchable
									data={relationshipOptions}
									defaultValue={relationship.sender.id}
									onChange={(sender) =>
										sender && relationship.setSender(containerResolver(sender))
									}
								/>
							}
						</Table.Td>
						<Table.Td>
							<Select
								variant={"unstyled"}
								searchable
								data={relationshipOptions}
								defaultValue={relationship.receiver.id}
								onChange={(receiver) =>
									receiver &&
									relationship.setReceiver(containerResolver(receiver))
								}
							/>
						</Table.Td>
						<Table.Td>
							<TextInput
								variant={"unstyled"}
								key={`${relationship.id}_desc`}
								defaultValue={relationship.description}
								onBlur={(e) => relationship.setDescription(e.target.value)}
							/>
						</Table.Td>
						<Table.Td>
							{
								<TextInput
									variant={"unstyled"}
									key={relationship.technology}
									defaultValue={relationship.technology}
									onBlur={(e) => relationship.setTechnology(e.target.value)}
								/>
							}
						</Table.Td>
						<Table.Td>
							<Menu position="bottom-start" shadow={"md"} width={200}>
								<Menu.Target>
									<ActionIcon variant={"subtle"}>
										<VscEllipsis style={{ transform: "rotate(90deg)" }} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item onClick={() => onRowDelete(relationship.id)}>
										Delete
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};
