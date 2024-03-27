import { FC } from "react";
import { PiQuestion } from "react-icons/pi";
import { VscCheck, VscError, VscTarget, VscWarning } from "react-icons/vsc";
import { match } from "ts-pattern";
import { WorkspaceEntityStatus } from "../workspace/WorkspaceEntityStatus.ts";

export type EntityStatusIconProps = {
	status: WorkspaceEntityStatus;
	size?: string | number;
};

export const EntityStatusIcon: FC<EntityStatusIconProps> = ({
	status,
	size,
}) => {
	return match(status)
		.with(WorkspaceEntityStatus.ACTIVE, () => <VscCheck size={size} />)
		.with(WorkspaceEntityStatus.INACTIVE, () => <VscWarning size={size} />)
		.with(WorkspaceEntityStatus.DEPRECATED, () => <VscError size={size} />)
		.with(WorkspaceEntityStatus.TARGET, () => <VscTarget size={size} />)
		.otherwise(() => <PiQuestion size={size} />);
};
