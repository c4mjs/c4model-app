import {
	AppShell,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { noop } from "lodash";
import { useState } from "react";
import { AppHeader } from "./AppHeader.tsx";
import { AppNavbar } from "./AppNavbar.tsx";
import bigBankPlc from "./big-bank-plc.json";
import { config } from "./config.ts";
import { SpotlightSearch } from "./containers/SpotlightSearch.tsx";
import { useExportWorkspace } from "./hooks/useExportWorkspace.ts";
import { useImportWorkspace } from "./hooks/useImportWorkspace.ts";
import { useSelection } from "./hooks/useSelection.ts";
import { ContainerPage } from "./pages/ContainerPage.tsx";
import { ExplorerPage } from "./pages/ExplorerPage.tsx";
import { GroupPage } from "./pages/GroupPage.tsx";
import { SystemPage } from "./pages/SystemPage.tsx";
import {
	Workspace,
	WorkspaceDto,
	WorkspaceProvider,
} from "./workspace/Workspace.ts";
import { WorkspaceContainer } from "./workspace/WorkspaceContainer.ts";
import { WorkspaceGroup } from "./workspace/WorkspaceGroup.ts";
import { WorkspaceSystem } from "./workspace/WorkspaceSystem.ts";

export const App = () => {
	const { colorScheme } = useMantineColorScheme();
	const { colors } = useMantineTheme();

	const selection = useSelection();

	const [workspace, setWorkspace] = useState<Workspace>(
		Workspace.fromDto(bigBankPlc as WorkspaceDto),
	);

	const [handle, setHandle] = useState<FileSystemFileHandle | undefined>();
	const handleLoad = useImportWorkspace();
	const handleSave = useExportWorkspace(workspace);
	useHotkeys([["mod+S", () => handleSave(handle).then(setHandle)]]);

	const handleNew = () => {
		setWorkspace(
			new Workspace(crypto.randomUUID(), "1.0.0", "New Workspace..."),
		);
		setHandle(undefined);
	};

	return (
		<AppShell
			styles={{
				root: { height: "100vh" },
				header: { display: "flex" },
				navbar: { display: "flex", flex: "auto" },
				main: {
					backgroundColor:
						colorScheme === "light" ? colors.gray[0] : colors.dark[8],
				},
			}}
			header={{ height: config.header.height }}
			navbar={{
				width: config.navbar.width,
				breakpoint: "xs",
			}}
		>
			<WorkspaceProvider value={workspace}>
				<AppShell.Header>
					<AppHeader
						id={workspace.id}
						name={workspace.name}
						onNameChange={(name) => workspace.setName(name)}
						onNew={handleNew}
						onOpen={() =>
							handleLoad().then(({ workspace, handle }) => {
								setWorkspace(workspace);
								setHandle(handle);
							})
						}
						onSave={() => handleSave(handle).then(setHandle)}
						onSaveAs={() => handleSave(undefined).then(setHandle)}
						onClose={noop}
						onSpotlight={spotlight.open}
					/>
					<SpotlightSearch />
				</AppShell.Header>

				<AppShell.Navbar>
					<AppNavbar />
				</AppShell.Navbar>

				<AppShell.Main>
					{!selection && <ExplorerPage />}
					{selection instanceof WorkspaceGroup && (
						<GroupPage group={selection} />
					)}
					{selection instanceof WorkspaceSystem && (
						<SystemPage system={selection} />
					)}
					{selection instanceof WorkspaceContainer && (
						<ContainerPage container={selection} />
					)}
				</AppShell.Main>
			</WorkspaceProvider>
		</AppShell>
	);
};
