import { NumberInput, Stack, Textarea } from "@mantine/core";
import React from "react";
import { PluginDrawer } from "../PluginDrawer.tsx";
import { PluginProps } from "../types.ts";
import { fromBase64, toBase64 } from "../utils.ts";
import { SvgPluginData } from "./types.ts";

export const SvgPlugin: React.FC<PluginProps<SvgPluginData>> = ({
	data,
	name,
	onNameChange,
	onDataChange,
	editing,
	onCloseEditing,
}) => {
	const defaultValue: SvgPluginData = {
		svg: fromBase64(data?.svg || ""),
		maxWidth: data?.maxWidth || 1000,
	};

	return (
		<Stack gap={0}>
			<PluginDrawer
				name={name}
				onNameChange={onNameChange}
				opened={editing}
				onClose={onCloseEditing}
			>
				<Stack>
					<NumberInput
						defaultValue={defaultValue.maxWidth}
						label={"Max Width"}
						onBlur={(e) =>
							onDataChange({ ...defaultValue, maxWidth: +e.target.value })
						}
						step={100}
					/>
					<Textarea
						defaultValue={defaultValue.svg}
						label={"Svg"}
						onBlur={(e) =>
							onDataChange({ ...defaultValue, svg: toBase64(e.target.value) })
						}
						autosize
						minRows={20}
					/>
				</Stack>
			</PluginDrawer>
			<Stack>
				{data?.svg && (
					<img
						style={{ maxWidth: data.maxWidth }}
						height={"auto"}
						src={`data:image/svg+xml;utf8,${encodeURIComponent(
							fromBase64(data.svg),
						)}`}
					/>
				)}
			</Stack>
		</Stack>
	);
};
