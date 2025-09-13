import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { email, otp } = credentials;

        // 1. Find OTP record
        const record = await prisma.otp.findFirst({
          where: { email, otp },
          orderBy: { createdAt: "desc" },
        });

        if (!record) return null;

        // 2. Check expiry (5 min)
        const isExpired =
          new Date().getTime() - new Date(record.createdAt).getTime() >
          5 * 60 * 1000;
        if (isExpired) return null;

        // 3. Get or create user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email },
          });
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
