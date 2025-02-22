import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null | undefined;
      name: string | null | undefined;
      email: string | null | undefined;
    };
  }
}