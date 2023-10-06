import { Stack, Text } from "@mantine/core";
import { FC } from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
} from "reactflow";
import { C4Dependency } from "./C4Diagram.ts";

export const MyEdge: FC<EdgeProps> = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const it = data.instance as C4Dependency;

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<Stack
					gap={0}
					className="nodrag nopan"
					styles={{
						root: {
							alignItems: "center",
							position: "absolute",
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							zIndex: 3,
						},
					}}
				>
					<Text size={"xs"}>{it.meta.description}</Text>
					{it.meta.technology && (
						<Text size={"xs"}>[{it.meta.technology}]</Text>
					)}
				</Stack>
			</EdgeLabelRenderer>
		</>
	);
};
