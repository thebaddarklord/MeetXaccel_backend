import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember_me: { label: 'Remember Me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              remember_me: credentials.remember_me === 'true',
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            // Handle specific error cases
            if (data.error) {
              throw new Error(data.error);
            }
            throw new Error('Invalid credentials');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.first_name} ${data.user.last_name}`,
            image: data.user.profile?.profile_picture,
            accessToken: data.token,
            user: data.user,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user || user;
      }
      
      return token;
    },
    
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  
  events: {
    async signOut({ token }) {
      // Call backend logout endpoint
      if (token.accessToken) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    },
  },
};