import { Button, MantineProvider, Stack, Text } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "reactflow/dist/style.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider
			defaultColorScheme={
				window.matchMedia?.("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
			}
			theme={{
				components: {
					Text: Text.extend({ defaultProps: { size: "sm" } }),
					Button: Button.extend({ defaultProps: { size: "sm" } }),
					Stack: Stack.extend({ defaultProps: { gap: "sm" } }),
				},
			}}
		>
			<Notifications />
			<ModalsProvider>
				<App />
			</ModalsProvider>
		</MantineProvider>
	</React.StrictMode>,
);
