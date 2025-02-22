import connectDB from "@/lib/mongodb";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/model/user";
import bcrypt from "bcryptjs";

// Define a type for your user
interface User {
  id: string;
  name: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined, req) {
        await connectDB();

        const username = credentials?.username;
        const password = credentials?.password;

        // Ensure username and password are defined
        if (!username || !password) {
          return null;
        }

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
          return null;
        }

        // Check if the password is correct
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        // Return the user object
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
