import { Text } from "@mantine/core";
import { modals, openConfirmModal } from "@mantine/modals";
import { useObservable } from "react-use";
import { openSelectModal } from "../modals/openSelectModal.tsx";
import {
	getNewRelationshipEntity,
	useWorkspaceDb,
} from "../workspaces/workspace-db.ts";
import { select } from "./useSelection.ts";
import { useWorkspaceTree } from "./useWorkspaceTree.ts";

export const useContainer = (id: string) => {
	const db = useWorkspaceDb();
	const tree = useWorkspaceTree();

	const container = useObservable(
		db.containers.findOne({ selector: { id } }).$,
	);

	const system = useObservable(
		db.systems.findOne({ selector: { id: container?.system } }).$,
	);

	const group = useObservable(
		db.groups.findOne({ selector: { id: system?.group } }).$,
	);

	const relationships = useObservable(
		db.relationships.find({
			selector: { $or: [{ sender: id }, { receiver: id }] },
		}).$,
		[],
	);

	const addRelationship = async () => {
		if (!container) return;
		await db.relationships.upsert(getNewRelationshipEntity(container.id));
	};

	const removeContainer = async () => {
		if (!container) return;

		openConfirmModal({
			title: "Are you sure?",
			children: <Text size="sm">This will remove '{container.name}'</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			onCancel: modals.closeAll,
			onConfirm: async () => {
				await container.remove();
				modals.closeAll();
				select(system);
			},
		});
	};

	const moveContainer = async () => {
		if (!container) return;

		openSelectModal({
			title: "Move Container",
			selectProps: {
				placeholder: "Software system",
				data: tree.systemInputSelectData,
				searchable: true,
			},
			labels: { confirm: "Move", cancel: "Cancel" },
			onCancel: modals.closeAll,
			onConfirm: async (system) => {
				await container.getLatest().patch({ system });
				modals.closeAll();
			},
		});
	};

	return {
		container,
		system,
		group,
		removeContainer,
		moveContainer,
		addRelationship,
		relationships,
	};
};
