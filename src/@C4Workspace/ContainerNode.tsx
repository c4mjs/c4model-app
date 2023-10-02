import { Card, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import React from "react";

import def from "../assets/container.drawio.svg";
import browser from "../assets/container_browser.drawio.svg";
import data from "../assets/container_data.drawio.svg";
import microservice from "../assets/container_microservice.drawio.svg";
import queue from "../assets/container_queue.drawio.svg";
import { C4Container } from "./types.ts";

export type C4ContainerNodeProps = {
	container: C4Container;
	onSelect: () => void;
};
export const C4ContainerNode: React.FC<C4ContainerNodeProps> = ({
	container,
	onSelect,
}) => {
	const { white } = useMantineTheme();
	const src = container.variant
		? { browser, data, queue, microservice }[container.variant]
		: def;

	return (
		<Card p={0} onClick={onSelect}>
			<img src={src} alt={""} />
			<Stack
				w={"100%"}
				h={"100%"}
				styles={{ root: { color: white, justifyContent: "center" } }}
				gap={2}
				pos={"fixed"}
				p={"xs"}
			>
				<Title order={5}>{container.name}</Title>
				<Text size={"xs"}>[Container]</Text>
				<Text size={"xs"}>{container.description}</Text>
			</Stack>
		</Card>
	);
};
