import { Spotlight, SpotlightActionData } from "@mantine/spotlight";
import { observer } from "mobx-react-lite";
import React from "react";
import { VscCompass, VscLayers, VscSearch } from "react-icons/vsc";
import { ContainerVariantIcon } from "../components/ContainerVariantIcon.tsx";
import { deselect, select } from "../hooks/useSelection.ts";
import { useWorkspace } from "../workspace/Workspace.ts";

export const SpotlightSearch: React.FC = observer(() => {
	const workspace = useWorkspace();

	const actions: SpotlightActionData[] = [
		{
			id: "explore",
			label: "Explore",
			description: "Get to explorer page",
			onClick: deselect,
			leftSection: <VscCompass />,
		},
		...workspace.systems.map((it) => ({
			id: it.id,
			label: it.name,
			group: it.group.name,
			description: it.description,
			onClick: () => select(it),
			leftSection: <VscLayers />,
		})),
		...workspace.containers.map((it) => ({
			id: it.id,
			label: it.name,
			group: `${it.system.name} (${it.system.group.name})`,
			description: it.description,
			onClick: () => select(it),
			leftSection: <ContainerVariantIcon variant={it.variant} />,
		})),
	];

	return (
		<Spotlight
			scrollable
			size={"xl"}
			actions={actions}
			nothingFound="Nothing found..."
			highlightQuery
			searchProps={{
				leftSection: <VscSearch stroke={1.5} />,
				placeholder: "Search...",
			}}
			shortcut={["mod+k", "mod+p"]}
		/>
	);
});
