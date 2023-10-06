import { keyBy } from "lodash";
import { MermaidPlugin } from "./mermaid/MermaidPlugin.tsx";
import { SwaggerUiPlugin } from "./swagger-ui/SwaggerUiPlugin.tsx";
import { PluginRegistryEntry } from "./types.ts";

export const availablePlugins: PluginRegistryEntry[] = [
	{ type: "swagger-ui", label: "Swagger UI", component: SwaggerUiPlugin },
	{ type: "mermaid", label: "MermaidJS", component: MermaidPlugin },
];

export const pluginsByType = keyBy(availablePlugins, "type");
