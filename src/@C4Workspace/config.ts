import { GraphLabel } from "dagre";

export const NODE_WIDTH = 300;

export const NODE_BASE_HEIGHT = 200; // Some Assets cause images to be larger

export const graphConfig: GraphLabel = {
	rankdir: "TD",
	ranksep: 200,
	nodesep: 100,
	ranker: "tight-tree",
};
