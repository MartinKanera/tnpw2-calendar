import type { Event } from "@prisma/client";

const fromISOString = (dateString: string, isAllDay: boolean): string => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  
  const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
  const [, year, month, day, hours, minutes] = regex.exec(date.toISOString()) || [];

  if (isAllDay) {
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
