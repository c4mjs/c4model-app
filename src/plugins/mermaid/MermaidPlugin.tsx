import { Stack, Textarea } from "@mantine/core";
import React from "react";
import { PluginDrawer } from "../PluginDrawer.tsx";
import { PluginProps } from "../types.ts";
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
						defaultValue={data?.chart || ""}
						label={"Chart"}
						onBlur={(e) => onDataChange({ chart: e.target.value })}
						autosize
						minRows={20}
					/>
				</Stack>
			</PluginDrawer>
			{data?.chart && <Mermaid key={data.chart} chart={data.chart} />}
		</Stack>
	);
};
