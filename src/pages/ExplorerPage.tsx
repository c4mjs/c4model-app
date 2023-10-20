import { SegmentedControl } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { Panel } from "reactflow";
import { match } from "ts-pattern";
import { C4NodeType } from "../@C4Workspace/C4Diagram.ts";
import { C4DiagramCanvas } from "../@C4Workspace/C4DiagramCanvas.tsx";
import { PageShell } from "../components/PageShell.tsx";
import { config } from "../config.ts";
import { useContainerDiagram } from "../hooks/useContainerDiagram.ts";
import { select } from "../hooks/useSelection.ts";
import { useSystemDiagram } from "../hooks/useSystemDiagram.ts";
import { useWorkspace } from "../workspace/Workspace.ts";

export type ExplorerPageProps = {};

export const ExplorerPage: FC<ExplorerPageProps> = observer(({}) => {
	const workspace = useWorkspace();
	const [nodeType, setNodeType] = useState(C4NodeType.SYSTEM);
	const systemDiagram = useSystemDiagram();
	const containerDiagram = useContainerDiagram();

	return (
		<PageShell h={`calc(100vh - ${config.header.height}px)`}>
			<C4DiagramCanvas
				diagram={match(nodeType)
					.with(C4NodeType.SYSTEM, () => systemDiagram)
					.with(C4NodeType.CONTAINER, () => containerDiagram)
					.exhaustive()}
				onNodeSelect={({ id }) =>
					match(nodeType)
						.with(C4NodeType.SYSTEM, () => select(workspace.getSystem(id)))
						.with(C4NodeType.CONTAINER, () =>
							select(workspace.getContainer(id)),
						)
						.exhaustive()
				}
			>
				<Panel position={"top-right"}>
					<SegmentedControl
						value={nodeType}
						data={[
							{ label: "System", value: C4NodeType.SYSTEM },
							{ label: "Container", value: C4NodeType.CONTAINER },
						]}
						onChange={(v: C4NodeType) => setNodeType(v)}
					/>
				</Panel>
			</C4DiagramCanvas>
		</PageShell>
	);
});
