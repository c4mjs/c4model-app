import { SegmentedControl, Tabs } from "@mantine/core";
import { FC, useState } from "react";
import { Panel } from "reactflow";
import { match } from "ts-pattern";
import { C4NodeType } from "../@C4Workspace/C4Diagram.ts";
import { C4DiagramCanvas } from "../@C4Workspace/C4DiagramCanvas.tsx";
import { useContainerDiagram } from "../hooks/useContainerDiagram.ts";
import { useSystemDiagram } from "../hooks/useSystemDiagram.ts";

export type C4DiagramsPanelProps = {
	ids: string[];
	value: string;
};

export const C4DiagramsPanel: FC<C4DiagramsPanelProps> = ({ ids, value }) => {
	const systemDiagram = useSystemDiagram(ids);
	const containerDiagram = useContainerDiagram(ids);

	const [nodeType, setNodeType] = useState(C4NodeType.SYSTEM);
	return (
		<Tabs.Panel
			key={ids.join("")}
			id={ids.join("")}
			value={value}
			styles={{
				panel: { flex: "auto", display: "flex" },
			}}
		>
			<C4DiagramCanvas
				diagram={match(nodeType)
					.with(C4NodeType.SYSTEM, () => systemDiagram)
					.with(C4NodeType.CONTAINER, () => containerDiagram)
					.exhaustive()}
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
		</Tabs.Panel>
	);
};
