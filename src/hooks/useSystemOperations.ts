import { modals, openConfirmModal } from "@mantine/modals";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import { useWorkspace } from "../workspace/Workspace.ts";
import { WorkspaceSystem } from "../workspace/WorkspaceSystem.ts";
import { select } from "./useSelection.ts";

export const useSystemOperations = (system: WorkspaceSystem) => {
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
				placeholder: "Group",
				data: workspace.groups.values().map((it) => ({
					value: it.id,
					label: it.name,
				})),
				searchable: true,
			},
			onCancel: modals.closeAll,
			onConfirm: (groupId) => {
				workspace.moveSystem(system.id, groupId);
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
				workspace.removeSystem(system.id);
				select(system.group);
				modals.closeAll();
			},
		});
	};

	return { move, remove };
};
