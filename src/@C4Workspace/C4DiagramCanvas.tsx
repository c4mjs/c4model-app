import { Stack, useMantineTheme } from "@mantine/core";
import React, { ReactNode, useMemo } from "react";
import { useObservable } from "react-use";
import {
	Background,
	Edge,
	EdgeTypes,
	Node,
	NodeTypes,
	ReactFlow,
} from "reactflow";
import { tap } from "rxjs";
import { C4Diagram, C4DiagramProvider, C4Node } from "./C4Diagram.ts";
import { MyEdge } from "./MyEdge.tsx";
import { MyNode } from "./MyNode.tsx";
import { MyNodeGroup } from "./MyNodeGroup.tsx";

const edgeTypes: EdgeTypes = {
	customEdge: MyEdge,
};

const nodeTypes: NodeTypes = {
	customNode: MyNode,
	customNodeGroup: MyNodeGroup,
};

export type WorkspaceCanvasProps = {
	diagram: C4Diagram;
	children?: ReactNode;
	onNodeSelect: (node: C4Node) => void;
};
export const C4DiagramCanvas: React.FC<WorkspaceCanvasProps> = ({
	diagram,
	children,
	onNodeSelect,
}) => {
	const { colors } = useMantineTheme();
	const positions = useMemo(() => diagram.getLayout(), [diagram]);

	useObservable(diagram.nodeSelection$.pipe(tap((it) => onNodeSelect(it))));

	const nodes: Node[] = useMemo(
		() => [
			...diagram.nodes.map(
				(instance): Node => ({
					id: instance.id,
					zIndex: 2,
					style: {
						height: positions[instance.id].height,
						width: positions[instance.id].width,
					},
					data: { instance, label: instance.name },
					position: positions[instance.id],
					type: "customNode",
				}),
			),
			...diagram.nodeGroups.map(
				(instance): Node => ({
					id: instance.id,
					zIndex: 1,
					style: {
						justifyContent: "start",
						alignItems: "end",
						color: colors.dark[2],
						height: positions[instance.id].height,
						width: positions[instance.id].width,
					},
					data: {
						instance,
					},
					type: "customNodeGroup",
					position: positions[instance.id],
				}),
			),
		],
		[diagram],
	);

	const edges: Edge[] = useMemo(
		() =>
			diagram.dependencies.map((instance) => ({
				id: instance.id,
				source: instance.sender.id,
				target: instance.receiver.id,
				label: "ToDO",
				data: { instance },
				animated: true,
				focusable: true,
				zIndex: 3,
				interactionWidth: 4,
				type: "customEdge",
			})),
		[diagram],
	);

	return (
		<C4DiagramProvider value={diagram}>
			<Stack style={{ flex: "auto" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodesDraggable={false}
					nodesConnectable={false}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					minZoom={0.1}
				>
					{children}
					<Background />
				</ReactFlow>
			</Stack>
		</C4DiagramProvider>
	);
};
