import { notifications } from "@mantine/notifications";

export const showErrorNotification = (error: Error) =>
	notifications.show({
		title: "Error",
		message: error.message,
		color: "red",
	});
