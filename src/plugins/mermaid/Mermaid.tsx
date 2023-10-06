import { Stack, useMantineColorScheme } from "@mantine/core";
import { useId } from "@mantine/hooks";
import mermaid from "mermaid";
import React, { useRef } from "react";

export type MermaidProps = {
	chart: string;
};
export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);
	const { colorScheme } = useMantineColorScheme();

	if (chart && ref.current) {
		mermaid.initialize({
			theme: colorScheme === "dark" ? "dark" : "default",
			darkMode: colorScheme === "dark",
		});
		mermaid.render(id, chart, ref.current).then((it) => {
			if (ref.current) ref.current.innerHTML = it.svg;
		});
	}

	return (
		<Stack>
			<div ref={ref} className="mermaid" />
		</Stack>
	);
};
