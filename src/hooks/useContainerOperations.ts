import { modals, openConfirmModal } from "@mantine/modals";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import { useWorkspace } from "../workspace/Workspace.ts";
import { WorkspaceContainer } from "../workspace/WorkspaceContainer.ts";
import { select } from "./useSelection.ts";

export const useContainerOperations = (container: WorkspaceContainer) => {
	const workspace = useWorkspace();

	const move = () => {
		openSelectModal({
			title: "Are you sure?",
			children: "This action is not reversible",
			labels: {
				cancel: "Cancel",
				confirm: "Move",
			},
			selectProps: {
				placeholder: "System",
				data: workspace.groups.values().map((group) => ({
					group: group.name,
					items: group.systems
						.values()
						.map((it) => ({ value: it.id, label: it.name })),
				})),
				searchable: true,
			},
			onCancel: modals.closeAll,
			onConfirm: (systemId) => {
				workspace.moveContainer(container.id, systemId);
				modals.closeAll();
			},
		});
	};

	const remove = () => {
		openConfirmModal({
			title: "Are you sure?",
			children: "This action is not reversible",
			labels: {
				cancel: "Cancel",
				confirm: "Remove",
			},
			onCancel: modals.closeAll,
			onConfirm: () => {
				workspace.removeContainer(container.id);
				select(container.system);
				modals.closeAll();
			},
		});
	};

	return { move, remove };
};
