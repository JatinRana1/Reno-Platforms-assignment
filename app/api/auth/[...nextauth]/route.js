import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/app/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,  // e.g. "smtp-relay.brevo.com"
        port: Number(process.env.EMAIL_SERVER_PORT), // usually 587
        auth: {
          user: process.env.EMAIL_SERVER_USER,  // your Brevo login (email or API key)
          pass: process.env.EMAIL_SERVER_PASSWORD, // your Brevo SMTP key
        },
      },
      from: process.env.EMAIL_FROM, // e.g. "no-reply@yourdomain.com"
      maxAge: 10 * 60,
    }),
  ],
  pages: {
    signIn: "/login", // use your custom login UI
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };