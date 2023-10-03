import { FC } from "react";
import { useObservable } from "react-use";
import { match } from "ts-pattern";
import { WorkspaceCanvas } from "../@C4Workspace/WorkspaceCanvas.tsx";
import { C4ContainerVariant } from "../@C4Workspace/types.ts";
import { useWorkspaceDb } from "../workspaces/workspace-db.ts";

export type ExplorerPageProps = {};

export const ExplorerPage: FC<ExplorerPageProps> = ({}) => {
	const db = useWorkspaceDb();

	const systems = useObservable(db.systems.find().$, []);
	const containers = useObservable(db.containers.find().$, []);
	const relationships = useObservable(
		db.relationships.find({
			selector: {
				sender: { $exists: true, $ne: "" },
				receiver: { $exists: true, $ne: "" },
			},
		}).$,
		[],
	);

	return (
		<div
			style={{
				height: "calc(100vh - 30px - 60px)",
				display: "flex",
			}}
		>
			<WorkspaceCanvas
				containers={containers.map((it) => ({
					id: it.id,
					name: it.name,
					description: it.description,
					system: it.system,
					variant: match(it.variant)
						.with("data", () => "data")
						.with("queue", () => "queue")
						.with("browser", () => "browser")
						.with("microservice", () => "microservice")
						.otherwise(() => undefined) as C4ContainerVariant,
				}))}
				systems={systems.map((it) => ({
					id: it.id,
					name: it.name,
					external: false,
				}))}
				dependencies={relationships.map((it) => ({
					id: it.id,
					sender: it.sender,
					receiver: it.receiver,
					description: it.description,
					technology: it.technology,
				}))}
			/>
		</div>
	);
};
