import dayjs from 'dayjs';
import jsonPatch, { Operation } from 'fast-json-patch';
import { promises as fs } from 'fs';
import path from 'path';

import {
  Appointment,
  AppointmentDateMap,
  Staff,
  Treatment,
} from '../../../shared/types';
import { AuthUser, NewAuthUser } from '../auth';

type JsonDataType = AuthUser | Appointment | Treatment | Staff;

const dbPath = 'db';
export enum filenames {
  users = 'users.json',
  appointments = 'appointments.json',
  treatments = 'treatments.json',
  staff = 'staff.json',
}

async function getJSONfromFile<ItemType extends JsonDataType>(
  filename: filenames,
): Promise<ItemType[]> {
  const filePath = path.join(dbPath, filename);
  const data = await fs.readFile(filePath);
  return JSON.parse(data.toString());
}

async function writeJSONToFile<T extends JsonDataType>(
  filename: filenames,
  data: Array<T>,
): Promise<void> {
  const filePath = path.join(dbPath, filename);
  const jsonData = JSON.stringify(data);
  await fs.writeFile(filePath, jsonData, { flag: 'w' });
}

async function deleteItem<T extends JsonDataType>(
  filename: filenames,
  itemId: number,
): Promise<number> {
  try {
    const items = await getJSONfromFile<T>(filename);
    const foundItemArray = items.filter((i) => i.id === itemId);
    if (foundItemArray.length !== 1) {
      throw new Error(`Could not find item id ${itemId} in ${filename}`);
    }
    const updatedItems = items.filter((i) => i.id !== itemId);
    await writeJSONToFile(filename, updatedItems);
    return itemId;
  } catch (e) {
    throw new Error(
      `Could not delete item id ${itemId} from ${filename}: ${e}`,
    );
  }
}

const { applyPatch } = jsonPatch;
async function updateItem<DataType extends JsonDataType>(
  itemId: number,
  filename: filenames,
  itemPatch: Operation[],
): Promise<DataType> {
  try {
    const items = await getJSONfromFile<DataType>(filename);

    const foundItems = items.filter((item) => item.id === itemId);
    if (foundItems.length !== 1) {
      throw new Error(`Could not find item with id ${itemId}`);
    }

    const updatedData = applyPatch(foundItems[0], itemPatch).newDocument;

    items.forEach((item, i) => {
      if (item.id === itemId) {
        items[i] = updatedData;
      }
    });

    await writeJSONToFile(filename, items);
    return updatedData;
  } catch (e) {
    throw new Error(
      `Could not delete item id ${itemId} from ${filename}: ${e}`,
    );
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  return getJSONfromFile<Appointment>(filenames.appointments);
}

export async function getAppointmentsByMonthYear(
  month: string,
  year: string,
): Promise<AppointmentDateMap> {
  const appointmentDateMap: AppointmentDateMap = {};
  const allAppointments = await getAppointments();

  allAppointments.forEach((appointment) => {
    const appointmentDate = dayjs(appointment.dateTime);
    if (
      appointmentDate.month() + 1 === Number(month) &&
      appointmentDate.year() === Number(year)
    ) {
      const dayNum = dayjs(appointment.dateTime).date();
      if (appointmentDateMap[dayNum]) {
        appointmentDateMap[dayNum].push(appointment);
      } else {
        appointmentDateMap[dayNum] = [appointment];
      }
    }
  });
  return appointmentDateMap;
}

export async function getTreatments(): Promise<Treatment[]> {
  return getJSONfromFile<Treatment>(filenames.treatments);
}

export async function getStaff(): Promise<Staff[]> {
  return getJSONfromFile<Staff>(filenames.staff);
}

export function getUsers(): Promise<AuthUser[]> {
  return getJSONfromFile<AuthUser>(filenames.users);
}

export async function getUserById(userId: number): Promise<AuthUser> {
  const users = await getUsers();
  const userData = users.filter((u) => u.id === userId);
  if (userData.length < 1) throw new Error('user not found');
  if (userData.length < 1) throw new Error('duplicate user found');
  return userData[0];
}

async function addUser(newUserData: NewAuthUser): Promise<AuthUser> {
  const users = await getUsers();

  const ids: number[] = Object.values(users).map((u) => u.id);
  const maxId = ids.reduce((tempMaxId: number, itemId: number) => {
    return itemId > tempMaxId ? itemId : tempMaxId;
  }, 0);

  const newUserId = maxId + 1;

  const newUser = { ...newUserData, id: newUserId };
  await writeJSONToFile(filenames.users, [...users, newUser]);
  return newUser;
}

async function writeAppointments(
  newAppointmentsArray: Appointment[],
): Promise<void> {
  await writeJSONToFile(filenames.appointments, newAppointmentsArray);
}

export default {
  filenames,
  writeAppointments,
  addUser,
  deleteItem,
  updateItem,
  getUsers,
  getUserById,
  getAppointments,
  getAppointmentsByMonthYear,
  getStaff,
  getTreatments,
};
