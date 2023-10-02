export type C4System = {
	id: string;
	name: string;
	external?: boolean;
};

export type C4ContainerVariant = "data" | "queue" | "browser" | "microservice";

export type C4Container = {
	id: string;
	name: string;
	description: string;
	system: string;
	variant?: C4ContainerVariant;
};

export type C4Dependency = {
	id: string;
	description: string;
	technology: string;
	sender: string;
	receiver: string;
};
