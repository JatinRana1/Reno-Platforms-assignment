import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // e.g. SMTP config
      from: process.env.EMAIL_FROM,     // e.g. "no-reply@yourapp.com"
      maxAge: 10 * 60, // ⏳ OTP/magic link expires in 10 minutes
    }),
  ],
  pages: {
    signIn: "/login", // use your custom login UI
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
