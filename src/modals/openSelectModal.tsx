import {
	Button,
	Group,
	ModalProps,
	Select,
	SelectProps,
	Stack,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { omit } from "lodash";
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
	const [value, setValue] = useState<string>(selectProps.defaultValue || "");

	return (
		<Stack>
			<Select
				onChange={(v) => v && setValue(v)}
				value={value}
				{...selectProps}
			/>
			<Group align={"end"} justify={"right"}>
				<Button onClick={onCancel} variant={"outline"}>
					Cancel
				</Button>
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

export type OpenSelectModalProps = Partial<Omit<ModalProps, "opened">> & {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	selectProps: SelectProps;
};
export const openSelectModal = (props: OpenSelectModalProps) =>
	modals.open({
		...omit(props, "selectProps", "onConfirm", "onCancel"),
		children: (
			<>
				{props.children && props.children}
				<ManagedSelect
					onCancel={props.onCancel}
					onConfirm={props.onConfirm}
					selectProps={props.selectProps}
				/>
			</>
		),
	});
