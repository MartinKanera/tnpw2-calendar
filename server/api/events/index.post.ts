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

  const { title, allDay, start, end } = await useValidatedBody(event, EventSchema);

  if (new Date(start) > new Date(end)) {
    throw createError({
      status: 400,
      message: "Start date must be before end date",
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
