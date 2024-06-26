import {
	ActionIcon,
	DefaultMantineColor,
	Menu,
	Stack,
	TextInput,
	Textarea,
} from "@mantine/core";
import { FC, ReactNode } from "react";

export type NameAndDescription = {
	id: string;
	defaultName: string;
	defaultDescription: string;
	onNameChange: (title: string) => void;
	onDescriptionChange: (title: string) => void;
	icon: ReactNode;
	onDelete?: () => void;
	onMove?: () => void;
	withMenu?: ReactNode;
	color?: DefaultMantineColor;
};

export const NameAndDescription: FC<NameAndDescription> = ({
	defaultName,
	onNameChange,
	onDescriptionChange,
	defaultDescription,
	icon,
	onDelete,
	onMove,
	id,
	withMenu,
	color,
}) => {
	return (
		<Stack gap={0}>
			<TextInput
				leftSection={
					<Menu position="bottom-start" shadow={"md"} width={200}>
						<Menu.Target>
							<ActionIcon variant={"subtle"} size={"lg"} color={color}>
								{icon}
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							{withMenu}
							{onMove && <Menu.Item onClick={onMove}>Move</Menu.Item>}
							{onDelete && <Menu.Item onClick={onDelete}>Delete</Menu.Item>}
						</Menu.Dropdown>
					</Menu>
				}
				key={`${id}_name`}
				styles={{ input: { fontWeight: 700, fontSize: 28 } }}
				variant={"unstyled"}
				size={"xl"}
				defaultValue={defaultName}
				onBlur={(v) => onNameChange(v.target.value || "")}
			/>
			<Textarea
				key={`${id}_desc`}
				variant={"unstyled"}
				placeholder={"Add a description"}
				defaultValue={defaultDescription}
				onBlur={(v) => onDescriptionChange(v.target.value || "")}
				autosize
			/>
		</Stack>
	);
};
