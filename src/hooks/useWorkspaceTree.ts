import { groupBy } from "lodash";
import { useMemo } from "react";
import { useObservable } from "react-use";
import { useWorkspaceDb } from "../workspaces/workspace-db.ts";

export const useWorkspaceTree = () => {
	const db = useWorkspaceDb();

	const groups = useObservable(
		db.groups.find({ sort: [{ name: "desc" }] }).$,
		[],
	);

	const systems = useObservable(
		db.systems.find({ sort: [{ name: "desc" }] }).$,
		[],
	);

	const systemsByGroup = useMemo(() => groupBy(systems, "group"), [systems]);

	const containers = useObservable(
		db.containers.find({ sort: [{ name: "desc" }] }).$,
		[],
	);

	const containersBySystem = useMemo(
		() => groupBy(containers, "system"),
		[containers],
	);

	const groupInputSelectData = useMemo(
		() =>
			groups.map((g) => ({
				value: g.id,
				label: g.name,
			})),
		[groups],
	);

	const systemInputSelectData = useMemo(
		() =>
			groups.map((g) => ({
				group: g.name,
				items:
					systemsByGroup[g.id]?.map((s) => ({
						value: s.id,
						label: s.name,
					})) || [],
			})),
		[groups, systemsByGroup],
	);

	const containerInputSelectData = useMemo(
		() =>
			systems.map((s) => ({
				group: s.name,
				items:
					containersBySystem[s.id]?.map((c) => ({
						value: c.id,
						label: c.name,
					})) || [],
			})),
		[systems, containersBySystem],
	);

	return {
		groups,
		systems,
		systemsByGroup,
		containersBySystem,
		systemInputSelectData,
		containerInputSelectData,
		groupInputSelectData,
	};
};
