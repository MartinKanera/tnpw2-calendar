import type { User as PrismaUser } from "@prisma/client";

declare module "@auth/core/types" {
  interface Session {
    user: Omit<PrismaUser, "password">;
  }
}
