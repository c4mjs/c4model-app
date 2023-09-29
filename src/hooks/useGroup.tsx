import { Text } from "@mantine/core";
import { modals, openConfirmModal } from "@mantine/modals";
import { useObservable } from "react-use";
import {
	getNewSystemEntity,
	useWorkspaceDb,
} from "../workspaces/workspace-db.ts";
import { deselect } from "./useSelection.ts";

export const useGroup = (id: string) => {
	const db = useWorkspaceDb();

	const group = useObservable(db.groups.findOne({ selector: { id } }).$);

	const systems = useObservable(
		db.systems.find({ selector: { group: id } }).$,
		[],
	);

	const addSystem = async () => {
		if (!group) return;
		await db.systems.upsert(getNewSystemEntity(group.id));
	};

	const remove = async () => {
		if (!group) return;

		const systemIds = systems
			.filter((it) => it.group === group.id)
			.map((it) => it.id);

		openConfirmModal({
			title: "Are you sure?",
			children: (
				<Text size="sm">
					This will remove '{group.name}' and '{systemIds.length}' systems .
				</Text>
			),
			labels: { confirm: "Confirm", cancel: "Cancel" },
			onCancel: () => modals.closeAll(),
			onConfirm: async () => {
				await db.systems.bulkRemove(systemIds);
				await group.remove();
				deselect();
				modals.closeAll();
			},
		});
	};

	return { group, systems, remove, addSystem };
};
