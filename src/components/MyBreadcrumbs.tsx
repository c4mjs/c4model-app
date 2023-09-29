import { Anchor, Breadcrumbs } from "@mantine/core";
import { FC } from "react";

export type MyBreadcrumbsProps = {
	data: { id: string; label: string; onClick?: () => void }[];
};

export const MyBreadcrumbs: FC<MyBreadcrumbsProps> = ({ data }) => {
	return (
		<Breadcrumbs>
			{data.map((it) => (
				<Anchor key={it.id} onClick={it.onClick}>
					{it.label}
				</Anchor>
			))}
		</Breadcrumbs>
	);
};
