import {
	AppShell,
	Button,
	Divider,
	Modal,
	Select,
	Stack,
	Text,
	Title,
	noop,
} from "@mantine/core";
import { match } from "ts-pattern";
import { AppHeader } from "./AppHeader.tsx";
import { AppNavbar } from "./AppNavbar.tsx";
import { useSelection } from "./hooks/useSelection.ts";
import { useWorkspaceAdapter } from "./hooks/useWorkspaceAdapter.ts";
import { ContainerPage } from "./pages/ContainerPage.tsx";
import { GroupPage } from "./pages/GroupPage.tsx";
import { SystemPage } from "./pages/SystemPage.tsx";
import { exportWorkspace, importWorkspace } from "./utils/import_export.tsx";
import { WorkspaceAdapterType } from "./workspaces/workspace-adapter.ts";
import { WorkspaceProvider } from "./workspaces/workspace-db.ts";

export const App = () => {
	const {
		adapter,
		setAdapterType,
		adapterType,
		handleSave,
		handleNewFile,
		handleOpenFile,
		setAdapter,
	} = useWorkspaceAdapter();

	const selection = useSelection();

	return (
		<AppShell
			styles={{
				root: { height: "100vh" },
				header: { display: "flex" },
				navbar: { display: "flex", flex: "auto" },
			}}
			header={{ height: 60 }}
			footer={{ height: 30 }}
			navbar={{
				width: 300,
				breakpoint: "xs",
			}}
		>
			<Modal opened={!adapter} onClose={noop} withCloseButton={false}>
				<Stack>
					<Title>C4 Model</Title>
					<Divider />
					<Select
						label={"Storage"}
						defaultValue={adapterType}
						data={[
							{
								value: WorkspaceAdapterType.BROWSER,
								label: "Local Browser Storage",
							},
							{ value: WorkspaceAdapterType.LOCAL, label: "Local File System" },
						]}
						onChange={(it) => setAdapterType(it as WorkspaceAdapterType)}
					/>
					<Divider />
					<Stack gap={"xs"}>
						<Button onClick={handleNewFile}>Create New Workspace</Button>
						<Button onClick={handleOpenFile}>Open Existing Workspace</Button>
					</Stack>
				</Stack>
			</Modal>
			{adapter && (
				<WorkspaceProvider value={adapter.c4db}>
					<AppShell.Header>
						<AppHeader
							onNew={() => {
								setAdapter(undefined);
							}}
							onOpen={handleOpenFile}
							onSave={handleSave}
							onClose={() => {
								setAdapter(undefined);
							}}
							onExport={() => exportWorkspace(adapter)}
							onImport={() => importWorkspace(adapter)}
						/>
					</AppShell.Header>

					<AppShell.Navbar>
						<AppNavbar />
					</AppShell.Navbar>

					<AppShell.Main>
						{selection &&
							match(selection.type)
								.with("group", () => <GroupPage id={selection?.id} />)
								.with("system", () => <SystemPage id={selection?.id} />)
								.with("container", () => <ContainerPage id={selection?.id} />)
								.otherwise(() => <Text>Dashboard...</Text>)}
					</AppShell.Main>

					<AppShell.Footer />
				</WorkspaceProvider>
			)}
		</AppShell>
	);
};
