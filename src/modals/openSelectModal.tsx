import { Button, Group, Select, SelectProps, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";
import { FC, useState } from "react";

type ManagedSelectProps = {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	selectProps: SelectProps;
};
const ManagedSelect: FC<ManagedSelectProps> = ({
	selectProps,
	onConfirm,
	onCancel,
}) => {
	const [value, setValue] = useState<string | null>(selectProps.defaultValue);

	return (
		<Stack>
			<Select onChange={(v) => setValue(v)} value={value} {...selectProps} />
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

export type OpenSelectModalProps = ModalSettings & {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	selectProps: SelectProps;
};
export const openSelectModal = (props: OpenSelectModalProps) =>
	modals.open({
		...props,
		children: (
			<>
				{...(props.children || [])}
				<ManagedSelect
					onCancel={props.onCancel}
					onConfirm={props.onConfirm}
					selectProps={props.selectProps}
				/>
			</>
		),
	});
