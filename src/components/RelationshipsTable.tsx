import { Select, Table, TextInput } from "@mantine/core";
import { FC } from "react";
import {
	ContainerEntity,
	RelationshipEntity,
	SystemEntity,
} from "../workspaces/workspace-db.ts";

export type RelationshipsTableProps = {
	relationships: RelationshipEntity[];
	onRowPatch: (
		id: string,
		changes: Partial<Omit<RelationshipEntity, "id">>,
	) => void;
	allContainers: ContainerEntity[];
	allSystems: SystemEntity[];
};

export const RelationshipsTable: FC<RelationshipsTableProps> = ({
	relationships,
	onRowPatch,
	allContainers,
}) => {
	return (
		<Table highlightOnHover>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Sender</Table.Th>
					<Table.Th>Receiver</Table.Th>
					<Table.Th>Description</Table.Th>
					<Table.Th>Technology</Table.Th>
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
									data={allContainers.map((c) => ({
										value: c.id,
										label: c.name,
									}))}
									value={relationship.sender}
									onChange={(sender) =>
										onRowPatch(relationship.id, { sender: sender || "" })
									}
								/>
							}
						</Table.Td>
						<Table.Td>
							<Select
								variant={"unstyled"}
								searchable
								data={allContainers.map((c) => ({
									value: c.id,
									label: c.name,
								}))}
								value={relationship.receiver}
								onChange={(receiver) =>
									onRowPatch(relationship.id, { receiver: receiver || "" })
								}
							/>
						</Table.Td>
						<Table.Td>
							<TextInput
								variant={"unstyled"}
								key={`${relationship.id}_desc`}
								defaultValue={relationship.description}
								onBlur={(e) =>
									onRowPatch(relationship.id, { description: e.target.value })
								}
							/>
						</Table.Td>
						<Table.Td>
							{
								<TextInput
									variant={"unstyled"}
									key={relationship.technology}
									defaultValue={relationship.technology}
									onBlur={(e) =>
										onRowPatch(relationship.id, { technology: e.target.value })
									}
								/>
							}
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};
