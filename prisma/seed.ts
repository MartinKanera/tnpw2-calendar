import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    prisma.$transaction(async (tx) => {
        const { id } = await tx.user.create({
            data: {
                id: "661175cc205e363c09345538",
                email: 'kanerma1@uhk.cz',
                // password: 'heslo123',
                password: '$2a$12$2duXTF42P0OF6mTn7SEqS.ly8hC6tLv7E2LVt0kj4gnTo.XgKAKMK',
            }
        });

        const multiDateStart = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
        const multiDateEnd = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();

        const hourBefore = new Date(new Date().setHours(new Date().getHours() - 1)).toISOString();
        const hourAfter = new Date(new Date().setHours(new Date().getHours() + 1)).toISOString();

        await tx.event.createMany({
            data: [
                {
                    title: 'All day 1',
                    userId: id,
                    start: multiDateStart,
                    end: multiDateEnd,
                    allDay: true,
                },
                {
                    title: 'All day 2',
                    userId: id,
                    start: multiDateStart,
                    end: multiDateEnd,
                    allDay: true,
                },
                {
                    title: 'Study',
                    userId: id,
                    start: hourBefore,
                    end: hourAfter,
                    allDay: false,
                }
            ]
        });
    })
}

main();
