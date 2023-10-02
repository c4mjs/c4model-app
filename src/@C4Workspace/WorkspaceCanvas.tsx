import { Stack, Text, useMantineTheme } from "@mantine/core";
import {
	compact,
	first,
	flatten,
	groupBy,
	keyBy,
	last,
	mapValues,
	uniq,
} from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
	Background,
	Controls,
	Edge,
	EdgeTypes,
	MiniMap,
	Node,
	NodeDimensionChange,
	NodePositionChange,
	ReactFlow,
	ReactFlowInstance,
	applyNodeChanges,
} from "reactflow";
import { C4ContainerNode } from "./ContainerNode.tsx";
import { MyEdge } from "./MyEdge.tsx";
import {
	NODE_BASE_HEIGHT,
	NODE_SYSTEM_CONTAINER_PADDING,
	NODE_WIDTH,
} from "./config.ts";
import { getLayout } from "./get-layout.ts";
import { C4Container, C4Dependency, C4System } from "./types.ts";

const edgeTypes: EdgeTypes = {
	custom: MyEdge,
};

export type WorkspaceCanvasProps = {
	systems: C4System[];
	containers: C4Container[];
	dependencies: C4Dependency[];
};
export const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({
	systems,
	containers,
	dependencies,
}) => {
	const { colors } = useMantineTheme();
	const [selected, setSelected] = useState<C4Container>();
	const [reactFlowInstance, setReactFlowInstance] =
		useState<ReactFlowInstance>();

	const applicableContainerIds = useMemo(
		() => uniq(dependencies.flatMap((it) => [it.sender, it.receiver])),
		[dependencies],
	);

	const applicableSystems = useMemo(
		() =>
			compact(
				uniq(
					containers
						.filter((it) => applicableContainerIds.includes(it.id))
						.map((it) => it.system)
						.map((id) => systems.find((sys) => sys.id === id)),
				),
			),
		[applicableContainerIds],
	);

	const initialContainerNodes: Node[] = useMemo(
		() =>
			containers
				.filter((it) => applicableContainerIds.includes(it.id))
				.map((it) => ({
					id: it.id,
					zIndex: 2,
					style: {
						width: NODE_WIDTH,
						padding: 0,
						backgroundColor: "unset",
						borderColor: "none",
						border: "none",
					},
					data: {
						...it,
						type: "container",
						label: (
							<C4ContainerNode
								key={it.id}
								container={it}
								onSelect={() => setSelected(it)}
							/>
						),
					},
					position: { x: 0, y: 0 },
				})),
		[applicableContainerIds],
	);

	const initialSystemNodes: Node[] = useMemo(
		() =>
			applicableSystems.map((it) => ({
				id: it.id,
				zIndex: 1,
				style: {
					width: 0,
					height: 0,
					padding: 20,
					border: "unset",
					backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${encodeURIComponent(
						colors.dark[2],
					)}' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
					display: "flex",
					backgroundColor: "unset",
					justifyContent: "start",
					alignItems: "end",
					color: colors.dark[2],
				},
				data: {
					...it,
					type: "system",
					label: (
						<Stack gap={0} align={"start"}>
							<Text>{it.name}</Text>
							<Text size={"sm"}>[Software System]</Text>
						</Stack>
					),
				},
				position: { x: 0, y: 0 },
			})),
		[applicableSystems],
	);

	const initialEdges: Edge[] = useMemo(
		() =>
			dependencies.map((it) => ({
				id: it.id,
				source: it.sender,
				target: it.receiver,
				label: it.description,
				data: { ...it },
				animated: true,
				focusable: true,
				zIndex: 3,
				interactionWidth: 4,
				type: "custom",
			})),
		[dependencies],
	);

	const [nodes, setNodes] = useState([
		...initialContainerNodes,
		...initialSystemNodes,
	]);
	const [edges, setEdges] = useState(initialEdges);

	useEffect(
		() => setNodes([...initialContainerNodes, ...initialSystemNodes]),
		[initialContainerNodes, initialSystemNodes],
	);
	useEffect(() => setEdges(initialEdges), [initialEdges]);

	useEffect(() => {
		const changes = getLayout(
			[...initialContainerNodes, ...initialSystemNodes],
			initialEdges,
			mapValues(
				keyBy(initialContainerNodes, (it) => it.id),
				(it) => it.data.system,
			),
		);

		let newNodes = applyNodeChanges(changes, [
			...initialContainerNodes,
			...initialSystemNodes,
		]);

		const _containers = newNodes.filter((it) => it.data.type === "container");
		const _systems = newNodes.filter((it) => it.data.type === "system");

		const _containersBySystem = groupBy(_containers, "data.system");

		const sysChanges = _systems.map(
			(it): [NodePositionChange, NodeDimensionChange] => {
				const xPositions = _containersBySystem[it.data.id]
					.map((it) => it.position.x)
					.sort((a, b) => a - b);

				const yPositions = _containersBySystem[it.data.id]
					.map((it) => it.position.y)
					.sort((a, b) => a - b);

				const leftmostX = first(xPositions) || 0;
				const rightmostX = last(xPositions) || 0;
				const topmostY = first(yPositions) || 0;
				const bottommostY = last(yPositions) || 0;

				const positionChange: NodePositionChange = {
					id: it.id,
					position: {
						x: leftmostX - NODE_SYSTEM_CONTAINER_PADDING,
						y: topmostY - NODE_SYSTEM_CONTAINER_PADDING,
					},
					type: "position",
					dragging: false,
				};

				const sizeChange: NodeDimensionChange = {
					id: it.id,
					type: "dimensions",
					resizing: false,
					updateStyle: true,
					dimensions: {
						width:
							rightmostX -
							leftmostX +
							NODE_WIDTH +
							NODE_SYSTEM_CONTAINER_PADDING * 2,
						height:
							bottommostY -
							topmostY +
							NODE_BASE_HEIGHT +
							NODE_SYSTEM_CONTAINER_PADDING * 2,
					},
				};

				return [positionChange, sizeChange];
			},
		);

		newNodes = applyNodeChanges(flatten(sysChanges), newNodes);

		setNodes(newNodes);
	}, [initialContainerNodes, initialEdges, initialSystemNodes]);

	useEffect(() => {
		const selectedNode =
			selected && nodes?.find((it) => it.id === selected?.id);
		if (selectedNode && reactFlowInstance) {
			reactFlowInstance.setCenter(
				selectedNode.position.x,
				selectedNode.position.y,
				{ zoom: reactFlowInstance.getZoom(), duration: 500 },
			);
		}
	}, [reactFlowInstance, selected]);

	return (
		<Stack style={{ flex: "auto" }}>
			<ReactFlow
				onInit={setReactFlowInstance}
				nodes={nodes}
				edges={edges}
				nodesDraggable={false}
				nodesConnectable={false}
				edgeTypes={edgeTypes}
			>
				<MiniMap />
				<Background />
				<Controls />
			</ReactFlow>
		</Stack>
	);
};
