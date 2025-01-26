import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { client } from '@/sanity/lib/client';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SanityAdapter } from 'next-auth-sanity';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]{
            _id,
            name,
            email,
            password,
            role
          }`,
          { email: credentials.email }
        );

        if (!user) {
          throw new Error('No user found with this email');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists in Sanity
        const existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email }
        );

        if (!existingUser) {
          // Create new user in Sanity
          await client.create({
            _type: 'user',
            name: user.name,
            email: user.email,
            role: 'user', // Default role
            image: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Fetch user role from Sanity
        const userData = await client.fetch(
          `*[_type == "user" && email == $email][0]{
            role
          }`,
          { email: token.email }
        );
        token.role = userData?.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  adapter: SanityAdapter(client),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 