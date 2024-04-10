import { useValidatedBody } from "h3-valibot";
import SignUpSchema from "~/server/schemas/SignUpSchema";
import prisma from "~/server/composables/prisma-clients";
import { hash } from "bcrypt";

export default defineEventHandler(async (event) => {
  const { username, email, password } = await useValidatedBody(event, SignUpSchema);

  let user = await prisma.user.findUnique({
    where: {
      email,
    }
  });

  if (user) {
    throw createError({
      statusCode: 409,
      statusMessage: "Email already taken",
    })
  }

  user = await prisma.user.findUnique({
    where: {
      username,
    }
  });

  if (user) {
    throw createError({
      statusCode: 409,
      statusMessage: "Username already taken",
    });
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  sendNoContent(event, 201);
});
