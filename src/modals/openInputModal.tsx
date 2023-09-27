import { Button, Group, Input, InputProps, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";
import { FC, useState } from "react";

type ManagedInputProps = {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	inputProps: InputProps;
};
const ManagedInput: FC<ManagedInputProps> = ({
	inputProps = {},
	onConfirm,
	onCancel,
}) => {
	const [value, setValue] = useState<string>();

	return (
		<Stack>
			<Input
				onChange={(v) => setValue(v.target.value)}
				value={value}
				{...inputProps}
			/>
			<Group align={"end"} justify={"right"}>
				<Button onClick={onCancel}>Cancel</Button>
				<Button
					disabled={!value}
					onClick={() => value && onConfirm(value)}
					mt="md"
				>
					Submit
				</Button>
			</Group>
		</Stack>
	);
};

export type OpenInputModalProps = ModalSettings & {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	inputProps: InputProps;
};
export const openInputModal = (props: OpenInputModalProps) =>
	modals.open({
		...props,
		children: (
			<>
				{...(props.children || [])}
				<ManagedInput
					onCancel={props.onCancel}
					onConfirm={props.onConfirm}
					inputProps={props.inputProps}
				/>
			</>
		),
	});
