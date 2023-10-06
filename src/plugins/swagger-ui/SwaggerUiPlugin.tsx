import { Stack, TextInput, useMantineColorScheme } from "@mantine/core";
import React, { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
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
	const { colorScheme } = useMantineColorScheme();

	useEffect(() => {
		if (colorScheme === "dark") {
			if (document.getElementById("swaggerUiCssDark")) return;

			const linkEl = document.createElement("link");
			linkEl.rel = "stylesheet";
			linkEl.id = "swaggerUiCssDark";
			linkEl.href = "/swagger-ui-dark.css";

			document.head.appendChild(linkEl);
		} else {
			document.getElementById("swaggerUiCssDark")?.remove();
		}
	}, [colorScheme]);

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
			{data?.url && <SwaggerUI displayOperationId url={data.url} />}
		</Stack>
	);
};
