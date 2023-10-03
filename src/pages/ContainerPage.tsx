import { Container, Stack } from "@mantine/core";
import { FC } from "react";
import { ContainerVariantIcon } from "../components/ContainerVariantIcon.tsx";
import { ContainerVariantMenu } from "../components/ContainerVariantMenu.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { RelationshipsTable } from "../components/RelationshipsTable.tsx";
import { TableWrapper } from "../components/TableWrapper.tsx";
import { useContainer } from "../hooks/useContainer.tsx";
import { select } from "../hooks/useSelection.ts";
import { useWorkspaceTree } from "../hooks/useWorkspaceTree.ts";

export const ContainerPage: FC<{ id: string }> = ({ id }) => {
	const {
		container,
		system,
		group,
		relationships,
		addRelationship,
		removeContainer,
		moveContainer,
	} = useContainer(id);

	const tree = useWorkspaceTree();

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
							onMove={moveContainer}
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
								onRowDelete={(id) =>
									relationships
										.find((it) => it.id === id)
										?.getLatest()
										.remove()
								}
								relationshipOptions={tree.containerInputSelectData}
							/>
						</TableWrapper>
					</Stack>
				)}
			</Stack>
		</Container>
	);
};
