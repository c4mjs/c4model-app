import {
	ActionIcon,
	Card,
	Collapse,
	MultiSelect,
	ScrollArea,
	SegmentedControl,
	Stack,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { VscChevronDown, VscChevronRight, VscTag } from "react-icons/vsc";
import { Panel } from "reactflow";
import { match } from "ts-pattern";
import { C4NodeType } from "../@C4Workspace/C4Diagram.ts";
import { C4DiagramCanvas } from "../@C4Workspace/C4DiagramCanvas.tsx";
import { MultiSelectCheckbox } from "../components/MultiSelectCheckbox.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { config } from "../config.ts";
import { useContainerDiagram } from "../hooks/useContainerDiagram.ts";
import { select } from "../hooks/useSelection.ts";
import { useSystemDiagram } from "../hooks/useSystemDiagram.ts";
import { useWorkspace } from "../workspace/Workspace.ts";

export type ExplorerPageProps = {};

export const ExplorerPage: FC<ExplorerPageProps> = observer(({}) => {
	const { spacing } = useMantineTheme();
	const workspace = useWorkspace();
	const [nodeType, setNodeType] = useState(C4NodeType.SYSTEM);
	const [filterPanelCollapsed, filterPanel] = useDisclosure(false);

	const systemDiagram = useSystemDiagram(
		isEmpty(workspace.explorerFilters) ? undefined : workspace.explorerFilters,
		isEmpty(workspace.explorerLabels) ? undefined : workspace.explorerLabels,
	);
	const containerDiagram = useContainerDiagram(
		isEmpty(workspace.explorerFilters) ? undefined : workspace.explorerFilters,
		isEmpty(workspace.explorerLabels) ? undefined : workspace.explorerLabels,
	);

	return (
		<PageShell h={`calc(100vh - ${config.header.height}px)`}>
			<C4DiagramCanvas
				diagram={match(nodeType)
					.with(C4NodeType.SYSTEM, () => systemDiagram)
					.with(C4NodeType.SYSTEMEXT, () => systemDiagram)
					.with(C4NodeType.CONTAINER, () => containerDiagram)
					.exhaustive()}
				onNodeSelect={({ id }) =>
					match(nodeType)
						.with(C4NodeType.SYSTEM, () => select(workspace.getSystem(id)))
						.with(C4NodeType.SYSTEMEXT, () => select(workspace.getSystem(id)))
						.with(C4NodeType.CONTAINER, () =>
							select(workspace.getContainer(id)),
						)
						.exhaustive()
				}
			>
				<Panel
					position={"top-left"}
					style={{ maxHeight: "75vh", display: "flex", flex: "auto" }}
				>
					<Card p={0} display={"flex"} shadow={"md"} flex={"auto"}>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								padding: spacing.sm,
								gap: spacing.sm,
							}}
						>
							<ActionIcon variant={"subtle"} onClick={filterPanel.toggle}>
								{filterPanelCollapsed ? (
									<VscChevronDown />
								) : (
									<VscChevronRight />
								)}
							</ActionIcon>
							<Title order={4}>Filter</Title>
						</div>
						<Collapse
							display={"flex"}
							flex={"auto"}
							style={{ overflow: "hidden" }}
							in={filterPanelCollapsed}
						>
							<Stack p={"md"}>
								<MultiSelect
									data={workspace.labels}
									leftSection={<VscTag />}
									placeholder={"Labels"}
									value={workspace.explorerLabels}
									onChange={(labels) => workspace.setExplorerLabels(labels)}
								/>
								<Title order={5}>Systems</Title>
								<ScrollArea offsetScrollbars>
									<MultiSelectCheckbox
										data={workspace.groups.values().map((g) => ({
											group: g.name,
											items: g.systems
												.values()
												.map((c) => ({ value: c.id, label: c.name })),
										}))}
										value={workspace.explorerFilters}
										onChange={(filters) =>
											workspace.setExplorerFilters(filters)
										}
									/>
								</ScrollArea>
							</Stack>
						</Collapse>
					</Card>
				</Panel>
				<Panel position={"top-right"}>
					<SegmentedControl
						value={nodeType}
						data={[
							{ label: "System", value: C4NodeType.SYSTEM },
							{ label: "Container", value: C4NodeType.CONTAINER },
						]}
						onChange={(v) => setNodeType(v as C4NodeType)}
					/>
				</Panel>
			</C4DiagramCanvas>
		</PageShell>
	);
});
