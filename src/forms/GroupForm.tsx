import { Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { FC } from "react";
import { z } from "zod";
import { GroupEntity } from "../workspaces/workspace-db.ts";
import { FormActions } from "./FormActions.tsx";

export const groupFormSchema = z.object({
	name: z.string().nonempty(),
});
export type GroupFormValues = Omit<GroupEntity, "id" | "type">;
export type GroupFormProps = {
	initialValues: GroupFormValues;
	onSave: (values: GroupFormValues) => void;
	onCancel: () => void;
	onDelete: () => void;
};
export const GroupForm: FC<GroupFormProps> = ({
	initialValues,
	onSave,
	onCancel,
	onDelete,
}) => {
	const form = useForm({
		validate: zodResolver(groupFormSchema),
		initialValues,
		validateInputOnBlur: true,
	});

	return (
		<Stack>
			<TextInput
				label="Name"
				placeholder="Group name"
				mt="sm"
				{...form.getInputProps("name")}
			/>
			<FormActions
				onDelete={onDelete}
				onCancel={onCancel}
				onSave={() => onSave(form.values)}
				saveDisabled={!form.isValid()}
			/>
		</Stack>
	);
};
