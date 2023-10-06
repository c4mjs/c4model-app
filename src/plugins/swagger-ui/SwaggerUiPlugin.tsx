import { Stack, TextInput } from "@mantine/core";
import React from "react";
import SwaggerUI from "swagger-ui-react";
import { PluginDrawer } from "../PluginDrawer.tsx";
import { PluginProps } from "../types.ts";
import { SwaggerUiPluginData } from "./types.ts";

export const SwaggerUiPlugin: React.FC<PluginProps<SwaggerUiPluginData>> = ({
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
				opened={editing}
				onClose={onCloseEditing}
				name={name}
				onNameChange={onNameChange}
			>
				<Stack>
					<TextInput
						defaultValue={data?.url || ""}
						label={"Url"}
						onBlur={(e) => onDataChange({ url: e.target.value })}
					/>
				</Stack>
			</PluginDrawer>
			{data?.url && <SwaggerUI url={data.url} />}
		</Stack>
	);
};
