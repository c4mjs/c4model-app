import { Stack, Text } from "@mantine/core";
import { FC } from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
} from "reactflow";

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
						},
					}}
				>
					<Text size={"xs"}>{data?.description}</Text>
					{data.technology && <Text size={"xs"}>[{data?.technology}]</Text>}
				</Stack>
			</EdgeLabelRenderer>
		</>
	);
};
