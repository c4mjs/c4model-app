import {
	AppShell,
	Button,
	Divider,
	Modal,
	Select,
	Stack,
	Title,
	noop,
} from "@mantine/core";
import { AppHeader } from "./AppHeader.tsx";
import { AppNavbar } from "./AppNavbar.tsx";
import { SelectionDrawer } from "./containers/SelectionDrawer.tsx";
import { useWorkspaceAdapter } from "./hooks/useWorkspaceAdapter.ts";
import { WorkspaceAdapterType } from "./workspaces/workspace-adapter.ts";
import { C4DbProvider } from "./workspaces/workspace-db.ts";

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

	return (
		<AppShell
			styles={{ root: { height: "100vh" } }}
			header={{ height: 60 }}
			footer={{ height: 30 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
			}}
			aside={{
				width: 300,
				breakpoint: "sm",
			}}
		>
			<Modal centered opened={!adapter} onClose={noop} withCloseButton={false}>
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
				<C4DbProvider value={adapter.c4db}>
					<AppShell.Header display={"flex"}>
						<AppHeader
							onNew={() => {
								setAdapter(undefined);
							}}
							onOpen={handleOpenFile}
							onSave={handleSave}
							onClose={() => {
								setAdapter(undefined);
							}}
						/>
					</AppShell.Header>

					<AppShell.Navbar>
						<AppNavbar />
					</AppShell.Navbar>
					<AppShell.Aside />

					<AppShell.Main />

					<AppShell.Footer />

					<SelectionDrawer />
				</C4DbProvider>
			)}
		</AppShell>
	);
};
