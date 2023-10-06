import { Stack, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { match } from "ts-pattern";
import { C4NodeGroup, C4NodeGroupType } from "./C4Diagram.ts";

export type MyNodeGroupProps = {
	data: { instance: C4NodeGroup };
};
export const MyNodeGroup: React.FC<MyNodeGroupProps> = ({ data }) => {
	const my: C4NodeGroup = data.instance;

	const { colors } = useMantineTheme();
	return (
		<Stack
			gap={2}
			h={"100%"}
			p={5}
			color={colors.dark[2]}
			styles={{
				root: {
					borderStyle: "dashed",
					borderWidth: 2,
					borderColor: colors.dark[2],
					color: colors.dark[2],
					borderRadius: 10,
				},
			}}
			align={"start"}
			justify={"end"}
		>
			<Text>{my.name}</Text>
			{match(my.type)
				.with(C4NodeGroupType.SYSTEM, () => <Text>[Software System]</Text>)
				.with(C4NodeGroupType.SYSTEM_BOUNDARY, () => (
					<Text>[System Boundary]</Text>
				))
				.exhaustive()}
		</Stack>
	);
};
