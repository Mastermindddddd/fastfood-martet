// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // prefer NEXTAUTH_SECRET but fallback to your SECRET
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
  session: { strategy: "jwt" }, // clearer session strategy
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");
        const passwordOk = await bcrypt.compare(credentials.password, user.password);
        if (!passwordOk) throw new Error("Invalid password");
        return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on sign in, attach user fields into the token
      if (user) {
        token.id = user.id || user.sub;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      // make sure session.user has the fields we expect
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      return session;
    },
  },
  logger: {
    error(code, ...rest) { console.error("NextAuth error:", code, ...rest); },
    warn(code, ...rest) { console.warn("NextAuth warn:", code, ...rest); },
    debug(code, ...rest) { if (process.env.NODE_ENV === "development") console.debug("NextAuth debug:", code, ...rest); },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export function isAdmin(session) {
  return session?.user?.role === 'admin';
}
