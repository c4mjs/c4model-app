import { ActionIcon, Card, Stack, Text } from "@mantine/core";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { Handle, Position } from "reactflow";
import { match } from "ts-pattern";
import { EntityStatusBadge } from "../components/EntityStatusBadge.tsx";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";
import { C4Node, C4NodeType, useC4Diagram } from "./C4Diagram.ts";

const backgroundColors: Record<C4NodeType, string> = {
	[C4NodeType.CONTAINER]: "#4FA0D4",
	[C4NodeType.SYSTEM]: "#2D5FAA",
	[C4NodeType.SYSTEMEXT]: "#8B8495",
};

export type MyNodeProps = {
	data: { instance: C4Node };
};
export const MyNode: React.FC<MyNodeProps> = ({ data }) => {
	const diagram = useC4Diagram();
	const my: C4Node = data.instance;

	return (
		<Stack h={"100%"}>
			<Card
				h={"100%"}
				withBorder
				shadow={"md"}
				styles={{
					root: {
						backgroundColor: backgroundColors[my.type],
						color: "white",
					},
				}}
			>
				<Stack gap={0} h={"100%"} align={"start"} justify={"start"}>
					<ActionIcon
						styles={{ root: { position: "absolute", top: 5, right: 5 } }}
						variant={"transparent"}
						color={"white"}
						onClick={() => diagram.nodeSelection$.next(my)}
					>
						<FiExternalLink />
					</ActionIcon>
					<Text fw={700} size={"xl"}>
						{my.name}
					</Text>
					{match(my.type)
						.with(C4NodeType.SYSTEM, () => (
							<Text size={"xs"}>[Software System]</Text>
						))
						.with(C4NodeType.SYSTEMEXT, () => (
							<Text size={"xs"}>[Software System]</Text>
						))
						.with(C4NodeType.CONTAINER, () => (
							<Text size={"xs"}>[Container: {my.meta.technology}]</Text>
						))
						.exhaustive()}
					{my.meta.description && (
						<Text pt="md" pb="md" size={"xs"}>
							{my.meta.description}
						</Text>
					)}
					{my.meta.status && (
						<EntityStatusBadge
							status={my.meta.status as WorkspaceEntityStatus}
							variant={"filled"}
							radius={"xs"}
							style={{
								position: "absolute",
								bottom: 10,
							}}
						/>
					)}
				</Stack>
			</Card>
			<Handle type="source" position={Position.Bottom} id={my.id} />
			<Handle type="target" position={Position.Top} />
		</Stack>
	);
};
