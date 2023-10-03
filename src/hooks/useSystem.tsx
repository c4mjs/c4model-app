import { Text } from "@mantine/core";
import { modals, openConfirmModal } from "@mantine/modals";
import { useObservable } from "react-use";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import {
	getNewContainerEntity,
	useWorkspaceDb,
} from "../workspaces/workspace-db.ts";
import { select } from "./useSelection.ts";
import { useWorkspaceTree } from "./useWorkspaceTree.ts";

export const useSystem = (id: string) => {
	const db = useWorkspaceDb();
	const tree = useWorkspaceTree();

	const system = useObservable(db.systems.findOne({ selector: { id } }).$);

	const group = useObservable(
		db.groups.findOne({ selector: { id: system?.group || "" } }).$,
	);

	const containers = useObservable(
		db.containers.find({ selector: { system: id } }).$,
		[],
	);

	const addContainer = async () => {
		if (!system) return;
		await db.containers.upsert(getNewContainerEntity(system.id));
	};

	const removeSystem = async () => {
		if (!system) return;

		openConfirmModal({
			title: "Are you sure?",
			children: <Text size="sm">This will remove '{system.name}'</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			onCancel: () => modals.closeAll(),
			onConfirm: async () => {
				await system.remove();
				modals.closeAll();
				select(group);
			},
		});
	};

	const moveSystem = async () => {
		if (!system) return;

		openSelectModal({
			title: "Move System",
			selectProps: {
				placeholder: "Group",
				data: tree.groupInputSelectData,
				searchable: true,
			},
			labels: { confirm: "Move", cancel: "Cancel" },
			onCancel: modals.closeAll,
			onConfirm: async (group) => {
				await system.getLatest().patch({ group });
				modals.closeAll();
			},
		});
	};

	return { group, system, containers, removeSystem, addContainer, moveSystem };
};
