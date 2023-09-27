import { NavLink, ScrollArea, Stack } from "@mantine/core";
import { FC, useMemo } from "react";
import { VscAdd } from "react-icons/vsc";
import { useObservable } from "react-use";
import { BehaviorSubject } from "rxjs";
import { select, useSelection } from "./hooks/useSelection.ts";
import { useC4Db } from "./workspaces/workspace-db.ts";

export const AppNavbar: FC = () => {
	const db = useC4Db();
	const selection = useSelection();

	const emptySubject = useMemo(() => new BehaviorSubject([]), []);

	const groups = useObservable(
		db?.collections.groups.find().$ || emptySubject,
		[],
	);

	return (
		<ScrollArea>
			<Stack gap={0}>
				{groups.map((it) => (
					<NavLink
						id={it.id}
						label={it.name}
						onClick={() => select(it)}
						active={selection === it}
					/>
				))}
				<NavLink
					leftSection={<VscAdd />}
					label={"Add"}
					onClick={() =>
						db.collections.groups.insert({
							id: crypto.randomUUID(),
							name: "Unnamed Group...",
						})
					}
				/>
			</Stack>
		</ScrollArea>
	);
};
