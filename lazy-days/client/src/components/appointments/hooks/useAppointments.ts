import dayjs from "dayjs";
import { useState } from "react";

import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

export function useAppointments() {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);


  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }


  const [showAll, setShowAll] = useState(false);


  const { userId } = useLoginData();

  const appointments: AppointmentDateMap = {};


  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
