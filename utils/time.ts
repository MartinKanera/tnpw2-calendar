import type { Event } from "@prisma/client";

export const fromISOString = (dateString: string, dateOnly: boolean): string => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);

  const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
  const [, year, month, day, hours, minutes] = regex.exec(date.toISOString()) || [];

  if (dateOnly) {
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const convertEventToCalendarEvent = (event: Event): any => {
  return {
    id: event.id,
    title: event.title,
    start: fromISOString(event.start.toString(), event.allDay),
    end: fromISOString(event.end.toString(), event.allDay)
  };
};

export const timeFromISOString = (dateString: string): string => {
  return fromISOString(dateString, false).split(" ")[1];
};

export const dateRoundedToNearestMinutes = (m = 15, fn = Math.floor) => {
  const coeff = 1000 * 60 * m;
  return new Date(fn(new Date().getTime() / coeff) * coeff);
}

// Return time HH:mm rounded to the nearest m minutes
export const timeRoundedToNearestMinutes = (m = 15, fn = Math.floor) => {
  return timeFromISOString(dateRoundedToNearestMinutes(m, fn).toISOString());
}

export const getMondayNow = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return new Date(monday.setHours(0, 0, 0, 0));
}

export const getSundayNow = () => {
  const sunday = new Date(getMondayNow().setDate(getMondayNow().getDate() + 6));
  return new Date(sunday.setHours(23, 59, 59, 999));
}
