import _, { isEmpty, isUndefined } from "lodash";
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
import { WorkspaceSystemVariant } from "../workspace/WorkspaceSystem.ts";

export const useSystemDiagram = (systemIds?: string[], labels?: string[]) => {
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
			)
			.filter(
				(it) =>
					isEmpty(labels) || it.labels.some((label) => labels?.includes(label)),
			);

		const containersInScope = findAllByIds(
			relationshipsInScope.flatMap((it) => [it.sender.id, it.receiver.id]),
			workspace.containers,
		);

		const systemsInScope = findAllByIds(
			_(containersInScope).map("system.id").uniq().value(),
			workspace.systems,
		);

		const groupsInScope = findAllByIds(
			_(systemsInScope).map("group.id").uniq().value(),
			workspace.groups.values(),
		);

		diagram.addNodeGroups(
			groupsInScope.map(
				(it) =>
					new C4NodeGroup(it.id, it.name, C4NodeGroupType.SYSTEM_BOUNDARY),
			),
		);

		const nodes = systemsInScope.map(
			(it) =>
				new C4Node(
					it.id,
					it.name,
					diagram.getNodeGroup(it.group.id),
					it.variant === WorkspaceSystemVariant.INTERNAL
						? C4NodeType.SYSTEM
						: C4NodeType.SYSTEMEXT,
					{ description: it.description, status: it.status },
				),
		);

		diagram.addNodes(nodes);

		const deps: C4Dependency[] = [];
		relationshipsInScope.forEach((r) => {
			const senderSystem = r.sender.system;
			const receiverSystem = r.receiver.system;

			if (
				senderSystem !== receiverSystem &&
				isUndefined(
					deps.find(
						(it) =>
							it.sender.id === senderSystem.id &&
							it.receiver.id === receiverSystem.id,
					),
				)
			) {
				deps.push(
					new C4Dependency(
						r.id,
						diagram.getNode(senderSystem.id),
						diagram.getNode(receiverSystem.id),
					),
				);
			}
		});
		diagram.addDependencies(deps);

		return diagram;
	}, [
		workspace.containers,
		workspace.systems,
		workspace.relationships,
		systemIds,
		labels,
	]);
};
