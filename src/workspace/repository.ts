import { cloneDeep, get, has, keyBy, keys, set, unset, values } from "lodash";
import { makeAutoObservable } from "mobx";
import { NamedEntity, WorkspaceEntity } from "./WorkspaceEntity.ts";

export class Repository<T extends WorkspaceEntity = NamedEntity> {
	private _entries: Array<T>;

	get entries(): Array<T> {
		return this._entries;
	}

	public readonly table: Record<string, T>;

	constructor(items: Array<T>) {
		makeAutoObservable(this);
		this.table = keyBy(items, "id");
		this._entries = this.values();
	}

	isEmpty(): boolean {
		return this.entries.length === 0;
	}

	keys(): string[] {
		return keys(this.table);
	}

	values(): T[] {
		return values(this.table);
	}

	has(id: string): boolean {
		return has(this.table, id);
	}

	get(id: string): T | undefined {
		return get(this.table, id);
	}

	upsert(entry: T) {
		set(this.table, entry.id, entry);
		this.updateCache();
		return entry;
	}

	bulkUpsert(entries: T[]) {
		entries.forEach((e) => set(this.table, e.id, e));
		this.updateCache();
		return;
	}

	safeGet(id: string): T {
		const item = this.get(id);
		if (!item) {
			console.debug(
				"Failed to find item  with id '%s' inside %O",
				id,
				cloneDeep(this.table),
			);
			throw new Error(`Unable to find item with id ${id} in lookup table`);
		}
		return item;
	}

	delete(id: string) {
		unset(this.table, id);
		this.updateCache();
	}

	deleteAll(ids: string[]) {
		ids.forEach((id) => unset(this.table, id));
		this.updateCache();
	}

	protected updateCache() {
		this._entries = this.values();
	}
}
