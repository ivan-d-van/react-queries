import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";



export function useCancelAppointment() {
  const toast = useCustomToast();

  return (appointment: Appointment) => {
  };
}
