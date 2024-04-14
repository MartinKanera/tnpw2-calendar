import { getServerSession } from "#auth";
import { useValidatedBody } from "h3-valibot";
import { authOptions } from "../auth/[...]";
import EventSchema from "~/server/schemas/EventSchema";
import prisma from "~/server/composables/prisma-clients";

export default defineEventHandler(async(event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      status: 401,
      message: "Unauthorized",
    });
  }

  const { title, allDay, ...range } = await useValidatedBody(
    event,
    EventSchema
  );

  const start = new Date(range.start);
  const end = new Date(range.end);

  if (allDay) {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (new Date(start) > new Date(end)) {
    throw createError({
      status: 400,
      message: "Invalid date range",
    });
  }

  return prisma.event.create({
    data: {
      title,
      allDay,
      start,
      end,
      userId: session.user.id,
    },
  })
});
