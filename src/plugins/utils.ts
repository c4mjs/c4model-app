import isBase64 from "validator/lib/isBase64";

export const fromBase64 = (value: string) =>
	(isBase64(value) && atob(value)) || value;

export const toBase64 = (value: string) => btoa(value);
