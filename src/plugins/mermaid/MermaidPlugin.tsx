import { Anchor, Group, Stack, Text, Textarea } from "@mantine/core";
import React from "react";
import { useObjectHash } from "../../hooks/useObjectHash.ts";
import { PluginDrawer } from "../PluginDrawer.tsx";
import { PluginProps } from "../types.ts";
import { fromBase64, toBase64 } from "../utils.ts";
import { Mermaid } from "./Mermaid.tsx";
import { MermaidPluginData } from "./types.ts";

export const MermaidPlugin: React.FC<PluginProps<MermaidPluginData>> = ({
	data,
	name,
	onNameChange,
	onDataChange,
	editing,
	onCloseEditing,
}) => {
	const defaultValue: MermaidPluginData = {
		chart: fromBase64(data?.chart || ""),
	};
	const key = useObjectHash(defaultValue);

	return (
		<Stack gap={0}>
			<PluginDrawer
				name={name}
				onNameChange={onNameChange}
				opened={editing}
				onClose={onCloseEditing}
			>
				<Stack>
					<Textarea
						styles={{ label: { width: "100%" } }}
						defaultValue={defaultValue.chart}
						label={
							<Group justify={"space-between"}>
								<Text fw={500}>Chart</Text>
								<Anchor
									variant={"text"}
									size={"xs"}
									href="https://mermaid.live/"
									target="_blank"
								>
									https://mermaid.live/
								</Anchor>
							</Group>
						}
						onBlur={(e) => onDataChange({ chart: toBase64(e.target.value) })}
						autosize
						minRows={20}
					/>
				</Stack>
			</PluginDrawer>
			<Mermaid key={key} chart={defaultValue.chart} />
		</Stack>
	);
};
