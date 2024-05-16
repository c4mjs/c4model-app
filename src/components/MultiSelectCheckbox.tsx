import { Checkbox, ComboboxItemGroup, Stack } from "@mantine/core";
import { isEmpty } from "lodash";
import React from "react";

export type MultiSelectCheckboxProps = {
	data: Array<ComboboxItemGroup>;
	onChange: (values: string[]) => void;
	value: string[];
};
export const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
	data,
	value,
	onChange,
}) => {
	return (
		<Stack style={{ overflow: "hidden" }}>
			{data.map((g) => (
				<Stack style={{ overflow: "hidden" }}>
					<Checkbox
						styles={{
							labelWrapper: {
								overflow: "hidden",
							},
							label: {
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
							},
						}}
						fw={"bold"}
						label={g.group}
						disabled={isEmpty(g.items)}
						checked={
							!isEmpty(g.items) &&
							g.items.every((item) =>
								typeof item === "string"
									? value.includes(item)
									: value.includes(item.value),
							)
						}
						onChange={(event) =>
							onChange(
								event.currentTarget.checked
									? [
											...value,
											...g.items.map((item) =>
												typeof item === "string" ? item : item.value,
											),
									  ]
									: value.filter(
											(it) =>
												!g.items
													.map((item) =>
														typeof item === "string" ? item : item.value,
													)
													.includes(it),
									  ),
							)
						}
					/>
					<Stack style={{ overflow: "hidden" }} pl={"md"}>
						{g.items.map((item) =>
							typeof item === "string" ? (
								<Checkbox
									styles={{
										labelWrapper: {
											overflow: "hidden",
										},
										label: {
											overflow: "hidden",
											whiteSpace: "nowrap",
											textOverflow: "ellipsis",
										},
									}}
									label={item}
									checked={value.includes(item)}
									onChange={(event) =>
										onChange(
											event.currentTarget.checked
												? [...value, item]
												: value.filter((it) => it !== item),
										)
									}
								/>
							) : (
								<Checkbox
									styles={{
										labelWrapper: {
											overflow: "hidden",
										},
										label: {
											overflow: "hidden",
											whiteSpace: "nowrap",
											textOverflow: "ellipsis",
										},
									}}
									label={item.label}
									checked={value.includes(item.value)}
									onChange={(event) =>
										onChange(
											event.currentTarget.checked
												? [...value, item.value]
												: value.filter((it) => it !== item.value),
										)
									}
								/>
							),
						)}
					</Stack>
				</Stack>
			))}
		</Stack>
	);
};
