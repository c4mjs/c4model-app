import _ from "lodash";
import { useMemo } from "react";
import {
	C4Dependency,
	C4Diagram,
	C4Node,
	C4NodeGroup,
	C4NodeGroupType,
	C4NodeType,
} from "../@C4Workspace/C4Diagram.ts";
import { findAllByIds } from "../utils/findAllByIds.ts";
import { useWorkspace } from "../workspace/Workspace.ts";

export const useContainerDiagram = (systemIds?: string[]) => {
	const workspace = useWorkspace();

	return useMemo(() => {
		const diagram = new C4Diagram([], [], []);

		const systemContainers = systemIds
			? workspace.containers.filter((it) => systemIds.includes(it.system.id))
			: workspace.containers;
		const systemContainerIds = _(systemContainers).map("id").uniq().value();

		const relationshipsInScope = workspace.relationships
			.values()
			.filter(
				(it) =>
					systemContainerIds.includes(it.sender.id) ||
					systemContainerIds.includes(it.receiver.id),
			);

		const containersInScope = findAllByIds(
			relationshipsInScope.flatMap((it) => [it.sender.id, it.receiver.id]),
			workspace.containers,
		);

		const systemsInScope = findAllByIds(
			_(containersInScope).map("system.id").uniq().value(),
			workspace.systems,
		);

		diagram.addNodeGroups(
			systemsInScope.map(
				(it) => new C4NodeGroup(it.id, it.name, C4NodeGroupType.SYSTEM),
			),
		);

		const nodes = containersInScope.map(
			(it) =>
				new C4Node(
					it.id,
					it.name,
					diagram.getNodeGroup(it.system.id),
					C4NodeType.CONTAINER,
					{ description: it.description, technology: it.technology },
				),
		);

		diagram.addNodes(nodes);

		const deps = relationshipsInScope.map(
			(it) =>
				new C4Dependency(
					it.id,
					diagram.getNode(it.sender.id),
					diagram.getNode(it.receiver.id),
					{ technology: it.technology, description: it.description },
				),
		);
		diagram.addDependencies(deps);

		return diagram;
	}, [workspace.containers, workspace.systems, workspace.relationships]);
};
