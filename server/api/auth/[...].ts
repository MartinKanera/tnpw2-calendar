import CredentialsProvider from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types"
import { NuxtAuthHandler } from "#auth"
import { safeParseAsync } from "valibot";
import type { User } from "@prisma/client";
import prisma from "~/server/composables/prisma-clients";
import { compare } from "bcrypt";
import LogInSchema from "~/server/schemas/LogInSchema";

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const result = await safeParseAsync(LogInSchema, credentials);

        if (!result.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: result.output.email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await compare(
          result.output.password.trim(),
          user.password,
        );

        if (!passwordValid) {
          return null;
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) { 
      const user = await prisma.user.findUnique({
        where: {
          id: (token.user as User).id,
        },
      })

      const userWithoutPassword = {
        ...user,
        password: undefined,
      };

      // @ts-ignore
      session.user = userWithoutPassword;
      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
