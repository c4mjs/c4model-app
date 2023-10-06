import { graphlib, layout } from "dagre";
import { keyBy } from "lodash";
import { NODE_BASE_HEIGHT, NODE_WIDTH, graphConfig } from "./config.ts";

export enum C4NodeType {
	CONTAINER = "CONTAINER",
	SYSTEM = "SYSTEM",
}

export enum C4NodeGroupType {
	SYSTEM = "SYSTEM",
	SYSTEM_BOUNDARY = "SYSTEM_BOUNDARY",
}

export type C4Metadata = {
	readonly description?: string;
	readonly technology?: string;
};

export class C4Node {
	readonly id: string;

	readonly name: string;

	readonly group: C4NodeGroup;

	readonly type: C4NodeType;

	readonly meta: C4Metadata;

	constructor(
		id: string,
		name: string,
		group: C4NodeGroup,
		type: C4NodeType,
		meta: C4Metadata = {},
	) {
		this.id = id;
		this.name = name;
		this.group = group;
		this.type = type;
		this.meta = meta;
	}
}

export class C4Dependency {
	readonly id: string;

	readonly sender: C4Node;

	readonly receiver: C4Node;

	readonly meta: C4Metadata;

	constructor(
		id: string,
		sender: C4Node,
		receiver: C4Node,
		meta: C4Metadata = {},
	) {
		this.id = id;
		this.sender = sender;
		this.receiver = receiver;
		this.meta = meta;
	}
}

export class C4NodeGroup {
	readonly id: string;

	readonly name: string;

	readonly type: C4NodeGroupType;

	constructor(id: string, name: string, type: C4NodeGroupType) {
		this.id = id;
		this.name = name;
		this.type = type;
	}
}

export class C4Diagram {
	readonly nodes: C4Node[];

	readonly nodeGroups: C4NodeGroup[];

	readonly dependencies: C4Dependency[];

	constructor(
		nodes: C4Node[],
		nodeGroups: C4NodeGroup[],
		dependencies: C4Dependency[],
	) {
		this.nodes = nodes;
		this.nodeGroups = nodeGroups;
		this.dependencies = dependencies;
	}

	addNodeGroups(nodeGroups: C4NodeGroup[]) {
		this.nodeGroups.push(...nodeGroups);
	}

	addNodes(nodes: C4Node[]) {
		this.nodes.push(...nodes);
	}

	addDependencies(dependencies: C4Dependency[]) {
		this.dependencies.push(...dependencies);
	}

	getNodeGroup(id: string): C4NodeGroup {
		const group = this.nodeGroups.find((it) => it.id === id);
		if (!group)
			throw new Error(`Node Group with id ${id} not present in diagram`);
		return group;
	}

	getNode(id: string): C4Node {
		const node = this.nodes.find((it) => it.id === id);
		if (!node) throw new Error(`Node with id ${id} not present in diagram`);
		return node;
	}

	getLayout(): Record<
		string,
		{ x: number; y: number; width: number; height: number }
	> {
		const g = new graphlib.Graph({ compound: true });
		// https://github.com/dagrejs/dagre/wiki#configuring-the-layout
		g.setGraph(graphConfig);
		g.setDefaultEdgeLabel(function () {
			return {};
		});

		this.nodeGroups.forEach((instance) => {
			g.setNode(instance.id, {
				label: instance.id,
			});
		});

		this.nodes.forEach((instance) => {
			g.setNode(instance.id, {
				label: instance.id,
				width: NODE_WIDTH,
				height: NODE_BASE_HEIGHT,
			});
			g.setParent(instance.id, instance.group.id);
		});

		this.dependencies.forEach(({ sender, receiver }) => {
			g.setEdge(sender.id, receiver.id);
		});

		layout(g);

		const l = keyBy(
			g
				.nodes()
				.map((id) => {
					const { x, y, height, width, label } = g.node(id);

					return {
						id: label,
						x: x - width / 2, // Adjust for Top Left Anchoring in React-Flow
						y: y - height / 2, // Adjust for Top Left Anchoring in React-Flow
						height,
						width,
					};
				})
				.filter(Boolean),
			"id",
		);

		// console.log(l);

		return l;
	}
}
