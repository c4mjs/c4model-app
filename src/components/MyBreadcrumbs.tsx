import { Anchor, Breadcrumbs, Center } from "@mantine/core";
import { FC, ReactNode } from "react";

export type MyBreadcrumbsProps = {
	data: { id: string; label: ReactNode; onClick?: () => void }[];
};

export const MyBreadcrumbs: FC<MyBreadcrumbsProps> = ({ data }) => {
	return (
		<Breadcrumbs>
			{data.map((it) => (
				<Anchor key={it.id} onClick={it.onClick}>
					<Center>{it.label}</Center>
				</Anchor>
			))}
		</Breadcrumbs>
	);
};
