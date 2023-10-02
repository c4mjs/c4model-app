import { Modal, Stack, Title } from "@mantine/core";
import { FC } from "react";
import { useLogger, useObservable } from "react-use";
import { match } from "ts-pattern";
import { WorkspaceCanvas } from "../@C4Workspace/WorkspaceCanvas.tsx";
import { C4ContainerVariant } from "../@C4Workspace/types.ts";
import { useWorkspaceDb } from "../workspaces/workspace-db.ts";

export type SystemContextCanvasProps = {
	id: string;
	opened: boolean;
	onClose: () => void;
};

export const SystemContainerCanvas: FC<SystemContextCanvasProps> = ({
	id,
	opened,
	onClose,
}) => {
	useLogger("SystemContainerCanvas");
	const db = useWorkspaceDb();

	const systems = useObservable(db.systems.find().$, []);
	const containers = useObservable(db.containers.find().$, []);
	const myContainerIds = containers
		.filter((it) => it.system === id)
		.map((it) => it.id);
	const relationships = useObservable(
		db.relationships.find({
			selector: {
				$or: [
					{
						sender: { $exists: true, $ne: "", $in: myContainerIds },
						receiver: { $exists: true, $ne: "" },
					},
					{
						sender: { $exists: true, $ne: "" },
						receiver: { $exists: true, $ne: "", $in: myContainerIds },
					},
				],
			},
		}).$,
		[],
	);

	return (
		<Modal
			title={<Title order={4}>Context</Title>}
			opened={opened}
			onClose={onClose}
			size={"90vw"}
			styles={{
				inner: { display: "flex" },
				content: {
					display: "flex",
					flexDirection: "column",
					width: "90vw",
					height: "90vh",
				},
				body: { display: "flex", flex: "auto" },
			}}
		>
			<Stack styles={{ root: { flex: "auto" } }}>
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
			</Stack>
		</Modal>
	);
};
