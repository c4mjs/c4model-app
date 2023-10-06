import { Stack, StackProps } from "@mantine/core";
import React from "react";
import { config } from "../config.ts";

export const PageShell: React.FC<StackProps> = ({ children, ...props }) => {
	return (
		<Stack
			p={"md"}
			styles={{
				root: {
					minHeight: `calc(100vh - ${config.header.height}px)`,
					display: "flex",
					position: "relative",
				},
			}}
			{...props}
		>
			{children}
		</Stack>
	);
};
