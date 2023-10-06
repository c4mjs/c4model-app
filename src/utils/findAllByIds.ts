import { filter } from "lodash";

export const findAllByIds = <T extends { id: string }>(
	ids: string[],
	entities: T[],
) => filter(entities, (it) => ids.includes(it.id));
