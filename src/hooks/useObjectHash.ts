import hash from "object-hash";
import { useMemo } from "react";

export const useObjectHash = (a: any) => useMemo(() => hash(a), [a]);
