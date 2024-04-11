import { useValidatedQuery } from "h3-valibot";
import { objectAsync, string, unionAsync, undefined_, null_ } from "valibot";
import prisma from "~/server/composables/prisma-clients";
import IsoDateTimeSchema from "~/server/schemas/IsoDateTimeSchema";
import { getServerSession } from '#auth';
import { authOptions } from "../auth/[...]";

export default defineEventHandler(async (event) => {
  const { start, end } = await useValidatedQuery(event, unionAsync([
    objectAsync({
      start: IsoDateTimeSchema,
      end: IsoDateTimeSchema
    }),
    objectAsync({
      start: undefined_(),
      end: undefined_()
    }),
    objectAsync({
      start: null_(),
      end: null_()
    })
  ]));

  const session = await getServerSession(event, authOptions);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  if (!start && !end) {
    return await prisma.event.findMany({
      where: {
        userId: session.user.id
      }
    });
  }

  if (new Date(start) > new Date(end)) {
    throw createError({
      message: 'Start date must be before end date',
      statusCode: 400
    });
  }

  return await prisma.event.findMany({
    where: {
      userId: session.user.id,
      AND: [
        {
          start: { gte: new Date(start) }
        },
        {
          end: { lte: new Date(end) }
        }
      ].filter(Boolean)
    }
  });
});
