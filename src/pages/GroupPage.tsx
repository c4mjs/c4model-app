import { Container, Stack } from "@mantine/core";
import { FC } from "react";
import { VscCompass, VscOrganization } from "react-icons/vsc";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { SystemsTable } from "../components/SystemsTable.tsx";
import { TableWrapper } from "../components/TableWrapper.tsx";
import { useGroup } from "../hooks/useGroup.tsx";
import { deselect, select } from "../hooks/useSelection.ts";

export const GroupPage: FC<{ id: string }> = ({ id }) => {
	const { group, systems, remove, addSystem } = useGroup(id);

	return (
		<Container>
			<Stack pt={"md"}>
				{group && (
					<Stack>
						<MyBreadcrumbs
							data={[
								{
									id: "home",
									label: <VscCompass />,
									onClick: () => deselect(),
								},
								{ id: group.id, label: group.name },
							]}
						/>
						<NameAndDescription
							id={group.id}
							defaultName={group.name}
							defaultDescription={group.description}
							onNameChange={(name) => group.getLatest().patch({ name })}
							onDescriptionChange={(description) =>
								group.getLatest().patch({ description })
							}
							icon={<VscOrganization size={"1.5rem"} />}
							onDelete={remove}
						/>
						<TableWrapper
							label={"Systems"}
							onAdd={addSystem}
							addTooltip={"Add System"}
						>
							<SystemsTable systems={systems} onRowSelect={select} />
						</TableWrapper>
					</Stack>
				)}
			</Stack>
		</Container>
	);
};
