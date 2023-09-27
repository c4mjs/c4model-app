import { useObservable } from "react-use";
import { BehaviorSubject } from "rxjs";

const selection$ = new BehaviorSubject(undefined);

export const select = (it: any) => selection$.next(it);

export const deselect = () => selection$.next(undefined);

export const useSelection = () => useObservable(selection$);
