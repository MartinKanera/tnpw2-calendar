import { useValidatedParams } from "h3-valibot";
import { objectAsync, string, toTrimmed, length, any } from "valibot";
import prisma from "~/server/composables/prisma-clients";
import { getServerSession } from "#auth";
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
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
    where: { id }
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

  await prisma.event.delete({
    where: { id, userId: session.user.id }
  });

  sendNoContent(event, 204);
});
