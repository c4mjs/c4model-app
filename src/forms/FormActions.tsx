import { Button, Group } from "@mantine/core";
import { FC } from "react";

export const FormActions: FC<{
	onSave?: () => void;
	onCancel?: () => void;
	onDelete?: () => void;
	saveDisabled?: boolean;
}> = ({ onSave, onCancel, onDelete, saveDisabled }) => {
	return (
		<Group mt="xl" justify={"space-between"}>
			<Group>
				{onDelete && (
					<Button variant={"outline"} color={"red"} onClick={onDelete}>
						Delete
					</Button>
				)}
			</Group>
			<Group>
				{onCancel && (
					<Button variant={"outline"} onClick={onCancel}>
						Cancel
					</Button>
				)}
				{onSave && (
					<Button disabled={saveDisabled} onClick={onSave}>
						Save
					</Button>
				)}
			</Group>
		</Group>
	);
};
