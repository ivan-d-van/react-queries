import { useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

export function useStaff() {
  const [filter, setFilter] = useState("all");

  const staff: Staff[] = [];

  return { staff, filter, setFilter };
}
