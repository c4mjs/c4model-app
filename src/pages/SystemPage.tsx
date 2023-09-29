import { Container, Stack } from "@mantine/core";
import { FC } from "react";
import { VscLayers } from "react-icons/vsc";
import { ContainersTable } from "../components/ContainersTable.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { TableWrapper } from "../components/TableWrapper.tsx";
import { select } from "../hooks/useSelection.ts";
import { useSystem } from "../hooks/useSystem.tsx";

export const SystemPage: FC<{ id: string }> = ({ id }) => {
	const { system, group, removeSystem, containers, addContainer } =
		useSystem(id);

	return (
		<Container>
			<Stack pt={"md"}>
				{system && group && (
					<Stack>
						<MyBreadcrumbs
							data={[
								{
									id: group.id,
									label: group.name,
									onClick: () => select(group),
								},
								{ id: system.id, label: system.name },
							]}
						/>
						<NameAndDescription
							id={system.id}
							defaultName={system.name}
							defaultDescription={system.description}
							onNameChange={(name) => system.getLatest().patch({ name })}
							onDescriptionChange={(description) =>
								system.getLatest().patch({ description })
							}
							icon={<VscLayers size={"1.5rem"} />}
							onDelete={removeSystem}
						/>
						<TableWrapper
							label={"Containers"}
							onAdd={addContainer}
							addTooltip={"Add Container"}
						>
							<ContainersTable containers={containers} onRowSelect={select} />
						</TableWrapper>
					</Stack>
				)}
			</Stack>
		</Container>
	);
};
