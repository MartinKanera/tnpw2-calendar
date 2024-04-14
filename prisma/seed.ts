import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getISOStringBFromOffset = (
  { days = 0, hours = 0, minutes = 0 },
  { constHours, constMinutes }: { constHours?: number, constMinutes?: number } = {}
): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);

  if (constHours) {
    date.setHours(constHours);
    date.setMinutes(0);
  }

  if (constMinutes) {
    date.setMinutes(constMinutes);
  }

  return date.toISOString();
}

const users = [
  {
    id: "661175cc205e363c09345538",
    username: "Matýsek",
    email: "kanerma1@uhk.cz",
    // password: "heslo123",
    password: "$2a$12$2duXTF42P0OF6mTn7SEqS.ly8hC6tLv7E2LVt0kj4gnTo.XgKAKMK",
    events: [
      {
        title: "Vacation",
        start: getISOStringBFromOffset({ days: -1 }),
        end: getISOStringBFromOffset({ days: 1 }),
        allDay: true,
      },
      {
        title: "Study",
        start: getISOStringBFromOffset({}, { constHours: 8 }),
        end: getISOStringBFromOffset({}, { constHours: 10 }),
        allDay: false,
      },
      {
        title: "Meeting",
        start: getISOStringBFromOffset({ days: 7 }, { constHours: 15 }),
        end: getISOStringBFromOffset({ days: 7 }, { constHours: 17 }),
        allDay: false,
      },
      {
        title: "Work",
        start: getISOStringBFromOffset({ days: 2 }, { constHours: 8 }),
        end: getISOStringBFromOffset({ days: 2 }, { constHours: 16 }),
        allDay: false,
      },
      {
        title: "Prepare for exam",
        start: getISOStringBFromOffset({ days: -1 }),
        end: getISOStringBFromOffset({ days: 3 }),
        allDay: true,
      },
      {
        title: "Birthday",
        start: getISOStringBFromOffset({ days: 6 }),
        end: getISOStringBFromOffset({ days: 6 }),
        allDay: true,
      },
      { 
        title: "Stop by school",
        start: getISOStringBFromOffset({ days: -4 }, { constHours: 10 }),
        end: getISOStringBFromOffset({ days: -4 }, { constHours: 12 }),
        allDay: false,
      }
    ]
  },
  {
    id: "661175cc205e363c09345539",
    username: "pepe",
    email: "pepa@uhk.cz",
    // password: "heslo123",
    password: "$2a$12$2duXTF42P0OF6mTn7SEqS.ly8hC6tLv7E2LVt0kj4gnTo.XgKAKMK",
    events: [
      {
        title: "Enjoying life",
        start: getISOStringBFromOffset({ days: -1 }),
        end: getISOStringBFromOffset({ days: 1 }),
        allDay: true,
      },
      {
        title: "Buy flowers",
        start: getISOStringBFromOffset({}, { constHours: 10 }),
        end: getISOStringBFromOffset({}, { constHours: 12 }),
        allDay: false,
      },
      {
        title: "Date",
        start: getISOStringBFromOffset({}, { constHours: 13 }),
        end: getISOStringBFromOffset({}, { constHours: 15 }),
        allDay: false,
      },
      {
        title: "Exam",
        start: getISOStringBFromOffset({ days: 2 }, { constHours: 8 }),
        end: getISOStringBFromOffset({ days: 2 }, { constHours: 12 }),
        allDay: false,
      }
    ]
  }
];

async function main() {
  prisma.$transaction(async (tx) => {
    
    for (const user of users) {
      const { events, ...userData } = user;
      const createdUser = await tx.user.create({
        data: userData,
      });

      await tx.event.createMany({
        data: events.map((event) => ({
          ...event,
          userId: createdUser.id,
        }))
      });
    }
  });
}

main();
