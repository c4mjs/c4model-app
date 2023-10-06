import { useObservable } from "react-use";
import { BehaviorSubject } from "rxjs";
import { WorkspaceContainer } from "../workspace/WorkspaceContainer.ts";
import { WorkspaceGroup } from "../workspace/WorkspaceGroup.ts";
import { WorkspaceSystem } from "../workspace/WorkspaceSystem.ts";

const selection$ = new BehaviorSubject<
	WorkspaceGroup | WorkspaceSystem | WorkspaceContainer | undefined
>(undefined);

export const select = (
	it: WorkspaceGroup | WorkspaceSystem | WorkspaceContainer,
) => selection$.next(it);

export const deselect = () => selection$.next(undefined);

export const useSelection = () => useObservable(selection$);
