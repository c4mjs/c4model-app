import { Button, Container, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";
import { FaShareNodes } from "react-icons/fa6";
import { VscCompass, VscLayers } from "react-icons/vsc";
import { ContainersTable } from "../components/ContainersTable.tsx";
import { MyBreadcrumbs } from "../components/MyBreadcrumbs.tsx";
import { NameAndDescription } from "../components/NameAndDescription.tsx";
import { TableWrapper } from "../components/TableWrapper.tsx";
import { SystemContainerCanvas } from "../containers/SystemContainerCanvas.tsx";
import { deselect, select } from "../hooks/useSelection.ts";
import { useSystem } from "../hooks/useSystem.tsx";

export const SystemPage: FC<{ id: string }> = ({ id }) => {
	const [contextOpened, context] = useDisclosure(false);
	const { system, group, removeSystem, moveSystem, containers, addContainer } =
		useSystem(id);

	return (
		<Container>
			<Stack pt={"md"}>
				{system && group && (
					<Stack>
						<MyBreadcrumbs
							data={[
								{
									id: "home",
									label: <VscCompass />,
									onClick: () => deselect(),
								},
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
							onMove={moveSystem}
						/>

						<Group>
							<Button
								onClick={context.open}
								size={"xs"}
								variant={"outline"}
								leftSection={<FaShareNodes />}
							>
								View System Container
							</Button>
						</Group>

						<SystemContainerCanvas
							id={id}
							opened={contextOpened}
							onClose={context.close}
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
