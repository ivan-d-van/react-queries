import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";

export function usePatchUser() {
  const { user, updateUser } = useUser();

  const patchUser = (newData: User | null) => {
  };

  return patchUser;
}
