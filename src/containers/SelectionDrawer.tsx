import { Drawer } from "@mantine/core";
import { FC } from "react";
import { deselect, useSelection } from "../hooks/useSelection.ts";

export const SelectionDrawer: FC = () => {
	const selected = useSelection();

	return (
		<Drawer opened={Boolean(selected)} onClose={deselect} position={"right"} />
	);
};
