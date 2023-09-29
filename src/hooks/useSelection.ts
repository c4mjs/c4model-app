import { useObservable } from "react-use";
import { BehaviorSubject } from "rxjs";
import {
	ContainerEntity,
	GroupEntity,
	SystemEntity,
} from "../workspaces/workspace-db.ts";

const selection$ = new BehaviorSubject<
	GroupEntity | SystemEntity | ContainerEntity | undefined
>(undefined);

export const select = (it: any) => selection$.next(it);

export const deselect = () => selection$.next(undefined);

export const useSelection = () => useObservable(selection$);
