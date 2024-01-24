import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

export function useUser() {
  const user: User = null;

  function updateUser(newUser: User): void {
  }

  function clearUser() {
  }

  return { user, updateUser, clearUser };
}
