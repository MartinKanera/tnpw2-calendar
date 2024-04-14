import { getServerSession } from "#auth";
import { objectAsync, string, toTrimmed, length } from "valibot";
import { useValidatedBody, useValidatedParams } from "h3-valibot";
import { authOptions } from "../auth/[...]";
import prisma from "~/server/composables/prisma-clients";

export default eventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const { id } = await useValidatedParams(
    event,
    objectAsync({
      id: string("This field is required", [
        toTrimmed(),
        length(24, "Invalid value")
      ]),
    }),
  );

  const foundEvent = await prisma.event.findUnique({
    where: { 
      id
    }
  })

  if (!foundEvent) {
    throw createError({
      statusCode: 404,
      statusMessage: "Event not found"
    });
  }

  if (foundEvent?.userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    });
  }

  const { title, allDay, start, end } = await useValidatedBody(
    event,
    EventSchema
  );

  return prisma.event.update({
    where: { 
      id,
      userId: session.user.id
    },
    data: {
      title,
      allDay,
      start,
      end,
    },
  });
});
