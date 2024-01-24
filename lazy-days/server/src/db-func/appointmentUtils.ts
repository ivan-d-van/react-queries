import dayjs from 'dayjs';

import { Appointment } from '../../../shared/types';
import db from '.';

function padNum(num: number | string): string {
  return num.toString().length === 1 ? `0${num}` : num.toString();
}

function makeAppointment(
  treatmentName: string,
  dateTime: dayjs.Dayjs,
  existingAppointmentsById: Record<number, Appointment>,
): Appointment {
  const id = Number(dayjs(dateTime).unix());

  if (existingAppointmentsById[id]) return existingAppointmentsById[id];

  const appointment: Appointment = {
    id,
    dateTime: dateTime.toDate(),
    treatmentName,
  };

  if (Math.floor(Math.random() * 10) % 3 === 0) appointment.userId = 100;

  return appointment;
}


export async function createAppointments(): Promise<void> {
  console.log('Creating appointments...');
  const existingAppointments = await db.getAppointments();

  const existingAppointmentsById = {};
  existingAppointments.forEach((a) => {
    existingAppointmentsById[a.id] = a;
  });

  const allAppointments: Appointment[] = [];

  const month = dayjs().month();
  const year = dayjs().year();

  for (let monthsFromNow = 1; monthsFromNow < 4; monthsFromNow++) {
    const monthString = padNum(month + monthsFromNow);
    const startDate = dayjs(`${year}${monthString}01`);
    const lastDate = Number(startDate.endOf('month').format('DD'));

    for (let i = 0; i < lastDate; i++) {
      const dayNum = i + 1;
      const thisDate = dayjs(`${year}${monthString}${padNum(dayNum)}`);
      const dayofWeek = Number(thisDate.format('d'));
      switch (dayofWeek) {
        case 1:
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(10, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'facial',
              thisDate.clone().add(14, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 2:
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(15, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 3:
          allAppointments.push(
            makeAppointment(
              'facial',
              thisDate.clone().add(11, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(16, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 4:
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(9, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'scrub',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        case 5:
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(13, 'hours'),
              existingAppointmentsById,
            ),
          );
          allAppointments.push(
            makeAppointment(
              'massage',
              thisDate.clone().add(15, 'hours'),
              existingAppointmentsById,
            ),
          );
          break;
        default:
          break;
      }
    }
  }

  for (let i = 0; i < allAppointments.length; i++) {
    if (i % 45 === 0) {
      let randNum = Math.floor(Math.random() * 14) - 7;
      if (randNum < 0) randNum = 0;
      if (randNum > allAppointments.length - 1)
        randNum = allAppointments.length - 1;
      allAppointments[i + randNum].userId = 1;
    }
  }
  await db.writeAppointments(allAppointments);
}
