import { FC } from "react";

export type PluginRegistryEntry = {
	type: string;
	label: string;
	component: FC<PluginProps<any>>;
};

export type PluginProps<T> = {
	name: string;
	onNameChange: (name: string) => void;
	data?: T;
	onDataChange: (data: T) => void;
	editing: boolean;
	onCloseEditing: () => void;
};
