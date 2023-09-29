import { Table } from "@mantine/core";
import { FC } from "react";
import { SystemEntity } from "../workspaces/workspace-db.ts";

export type SystemsTableProps = {
	systems: SystemEntity[];
	onRowSelect: (system: SystemEntity) => void;
};

export const SystemsTable: FC<SystemsTableProps> = ({
	systems,
	onRowSelect,
}) => {
	return (
		<Table highlightOnHover>
			<Table.Thead>
				<Table.Tr>
					<Table.Th w={200}>Name</Table.Th>
					<Table.Th>Description</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{systems.map((system) => (
					<Table.Tr key={system.id} onClick={() => onRowSelect(system)}>
						<Table.Td>{system.name}</Table.Td>
						<Table.Td>{system.description}</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};
