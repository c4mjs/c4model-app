import { FC } from "react";
import { PiHexagonLight, PiQuestion, PiRectangle } from "react-icons/pi";
import { VscBrowser, VscDatabase, VscDeviceMobile } from "react-icons/vsc";
import { match } from "ts-pattern";
import { WorkspaceContainerVariant } from "../workspace/WorkspaceContainer.ts";

export type ContainerVariantIconProps = {
	variant: WorkspaceContainerVariant;
	size?: string | number;
};

export const ContainerVariantIcon: FC<ContainerVariantIconProps> = ({
	variant,
	size,
}) => {
	return match(variant)
		.with(WorkspaceContainerVariant.DATA, () => <VscDatabase size={size} />)
		.with(WorkspaceContainerVariant.BROWSER, () => <VscBrowser size={size} />)
		.with(WorkspaceContainerVariant.MOBILE, () => (
			<VscDeviceMobile size={size} />
		))
		.with(WorkspaceContainerVariant.DEFAULT, () => <PiRectangle size={size} />)
		.with(WorkspaceContainerVariant.MICROSERVICE, () => (
			<PiHexagonLight size={size} style={{ transform: "rotate(90deg)" }} />
		))
		.with(WorkspaceContainerVariant.QUEUE, () => (
			<VscDatabase size={size} style={{ transform: "rotate(90deg)" }} />
		))
		.otherwise(() => <PiQuestion size={size} />);
};
