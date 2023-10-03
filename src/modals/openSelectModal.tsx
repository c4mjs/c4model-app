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
	labels: { confirm: string; cancel: string };
};
const ManagedSelect: FC<ManagedSelectProps> = ({
	selectProps,
	onConfirm,
	onCancel,
	labels,
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
					{labels.cancel}
				</Button>
				<Button
					disabled={!value}
					onClick={() => value && onConfirm(value)}
					mt="md"
				>
					{labels.confirm}
				</Button>
			</Group>
		</Stack>
	);
};

export type OpenSelectModalProps = Partial<Omit<ModalProps, "opened">> & {
	onCancel: () => void;
	onConfirm: (value: string) => void;
	selectProps: SelectProps;
	labels: { confirm: string; cancel: string };
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
					labels={props.labels}
				/>
			</>
		),
	});
