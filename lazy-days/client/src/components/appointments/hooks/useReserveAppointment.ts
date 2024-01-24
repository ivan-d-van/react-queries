import { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";


export function useReserveAppointment() {
  const { userId } = useLoginData();

  const toast = useCustomToast();

  return (appointment: Appointment) => {
  };
}
