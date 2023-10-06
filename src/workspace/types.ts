export type RecordOf<T extends { id: string }> = Record<T["id"], Omit<T, "id">>;

export type ArrayOf<T extends { id: string }> = Array<T>;

export type Modify<T, R> = Omit<T, keyof R> & R;
