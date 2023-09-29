import { Table } from "@mantine/core";
import { FC } from "react";
import { ContainerEntity } from "../workspaces/workspace-db.ts";

export type ContainersTableProps = {
	containers: ContainerEntity[];
	onRowSelect: (container: ContainerEntity) => void;
};

export const ContainersTable: FC<ContainersTableProps> = ({
	containers,
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
				{containers.map((container) => (
					<Table.Tr key={container.id} onClick={() => onRowSelect(container)}>
						<Table.Td>{container.name}</Table.Td>
						<Table.Td>{container.description}</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};
