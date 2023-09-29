import { ActionIcon, Group, Stack, Title, Tooltip } from "@mantine/core";
import { FC, ReactNode } from "react";
import { VscAdd } from "react-icons/vsc";

export type TableWrapperProps = {
	label: string;
	children: ReactNode;
	onAdd?: () => void;
	addTooltip?: string;
};

export const TableWrapper: FC<TableWrapperProps> = ({
	label,
	children,
	onAdd,
	addTooltip,
}) => {
	return (
		<Stack>
			<Group justify={"space-between"}>
				<Title order={4}>{label}</Title>
				{onAdd && (
					<Tooltip label={addTooltip} openDelay={500}>
						<ActionIcon variant={"subtle"} onClick={onAdd}>
							<VscAdd />
						</ActionIcon>
					</Tooltip>
				)}
			</Group>
			{children}
		</Stack>
	);
};
