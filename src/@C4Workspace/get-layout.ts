import { graphlib, layout } from "dagre";
import { keyBy } from "lodash";
import { Edge, Node, NodePositionChange } from "reactflow";
import { NODE_DAGRE_HEIGHT, NODE_DAGRE_WIDTH } from "./config.ts";

export const getLayout = (
	nodes: Node[],
	edges: Edge[],
	parents: Record<string, string | undefined>,
): NodePositionChange[] => {
	console.log(nodes);
	console.log(edges);

	const g = new graphlib.Graph({ compound: true });
	g.setGraph({ rankdir: "TD" });
	g.setDefaultEdgeLabel(function () {
		return {};
	});

	nodes.forEach(({ id }) => {
		g.setNode(id, {
			label: id,
			width: NODE_DAGRE_WIDTH,
			height: NODE_DAGRE_HEIGHT,
		});
		const parent = parents[id];
		parent && g.setParent(id, parent);
	});

	edges.forEach(({ source, target }) => {
		g.setEdge(source, target);
	});

	layout(g);

	const _layout = keyBy(
		g
			.nodes()
			.map((id) => g.node(id))
			.filter(Boolean)
			.map(({ x, y, label }) => ({ x, y, id: label })),
		"id",
	);

	return nodes.map((it) => ({
		id: it.id,
		position: _layout[it.id],
		type: "position",
	}));
};
