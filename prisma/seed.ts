import { PrismaClient } from '@prisma/client';

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

async function main() {
    prisma.$transaction(async (tx) => {
        const { id } = await tx.user.create({
            data: {
                id: "661175cc205e363c09345538",
                username: 'Matýsek',
                email: 'kanerma1@uhk.cz',
                // password: 'heslo123',
                password: '$2a$12$2duXTF42P0OF6mTn7SEqS.ly8hC6tLv7E2LVt0kj4gnTo.XgKAKMK',
            }
        });

        await tx.event.createMany({
            data: [
                {
                    title: 'Vacation',
                    userId: id,
                    start: getISOStringBFromOffset({ days: -1 }),
                    end: getISOStringBFromOffset({ days: 1 }),
                    allDay: true,
                },
                {
                    title: 'Study',
                    userId: id,
                    start: getISOStringBFromOffset({}, { constHours: 8 }),
                    end: getISOStringBFromOffset({}, { constHours: 10 }),
                    allDay: false,
                },
                {
                    title: 'Meeting',
                    userId: id,
                    start: getISOStringBFromOffset({ days: 7 }, { constHours: 15 }),
                    end: getISOStringBFromOffset({ days: 7 }, { constHours: 17 }),
                    allDay: false,
                }
            ]
        });
    })
}

main();
