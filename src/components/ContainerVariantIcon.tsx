import { FC } from "react";
import { PiHexagonLight, PiQuestion, PiRectangle } from "react-icons/pi";
import { VscBrowser, VscDatabase, VscDeviceMobile } from "react-icons/vsc";
import { match } from "ts-pattern";
import { ContainerEntity } from "../workspaces/workspace-db.ts";

export type ContainerVariantIconProps = {
	variant: ContainerEntity["variant"];
	size?: string | number;
};

export const ContainerVariantIcon: FC<ContainerVariantIconProps> = ({
	variant,
	size,
}) => {
	return match(variant)
		.with("data", () => <VscDatabase size={size} />)
		.with("browser", () => <VscBrowser size={size} />)
		.with("mobile", () => <VscDeviceMobile size={size} />)
		.with("default", () => <PiRectangle size={size} />)
		.with("microservice", () => (
			<PiHexagonLight size={size} style={{ transform: "rotate(90deg)" }} />
		))
		.with("queue", () => (
			<VscDatabase size={size} style={{ transform: "rotate(90deg)" }} />
		))
		.otherwise(() => <PiQuestion size={size} />);
};
