import { Container, Stack } from "@mantine/core";
import { FC } from "react";
import { useObservable } from "react-use";
import { ContainerVariantIcon } from "../components/ContainerVariantIcon.tsx";
import { ContainerVariantMenu } from "../components/ContainerVariantMenu.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { RelationshipsTable } from "../components/RelationshipsTable.tsx";
import { TableWrapper } from "../components/TableWrapper.tsx";
import { useContainer } from "../hooks/useContainer.tsx";
import { select } from "../hooks/useSelection.ts";
import { useWorkspaceDb } from "../workspaces/workspace-db.ts";

export const ContainerPage: FC<{ id: string }> = ({ id }) => {
	const db = useWorkspaceDb();

	const {
		container,
		system,
		group,
		relationships,
		addRelationship,
		removeContainer,
	} = useContainer(id);

	const containers = useObservable(db.containers.find().$, []);
	const systems = useObservable(db.systems.find().$, []);

	return (
		<Container>
			<Stack pt={"md"}>
				{container && system && group && (
					<Stack>
						<MyBreadcrumbs
							data={[
								{
									id: group.id,
									label: group.name,
									onClick: () => select(group),
								},
								{
									id: system.id,
									label: system.name,
									onClick: () => select(system),
								},
								{ id: container.id, label: container.name },
							]}
						/>
						<NameAndDescription
							id={container.id}
							defaultName={container.name}
							defaultDescription={container.description}
							onNameChange={(name) => container.getLatest().patch({ name })}
							onDescriptionChange={(description) =>
								container.getLatest().patch({ description })
							}
							icon={
								<ContainerVariantIcon
									variant={container.variant}
									size={"1.5rem"}
								/>
							}
							onDelete={removeContainer}
							withMenu={
								<ContainerVariantMenu
									variant={container.variant}
									onChange={(variant) =>
										container.getLatest().patch({ variant })
									}
								/>
							}
						/>
						<TableWrapper
							label={"Relationships"}
							addTooltip={"Add Relationship"}
							onAdd={addRelationship}
						>
							<RelationshipsTable
								relationships={relationships}
								onRowPatch={(id, update) =>
									relationships
										.find((it) => it.id === id)
										?.getLatest()
										.patch(update)
								}
								allContainers={containers}
								allSystems={systems}
							/>
						</TableWrapper>
					</Stack>
				)}
			</Stack>
		</Container>
	);
};
