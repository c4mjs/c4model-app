import { modals, openConfirmModal } from "@mantine/modals";
import { useWorkspace } from "../workspace/Workspace.ts";
import { WorkspaceGroup } from "../workspace/WorkspaceGroup.ts";
import { deselect } from "./useSelection.ts";

export const useGroupOperations = (group: WorkspaceGroup) => {
	const workspace = useWorkspace();

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
				workspace.removeGroup(group.id);
				deselect();
				modals.closeAll();
			},
		});
	};

	return { remove };
};
