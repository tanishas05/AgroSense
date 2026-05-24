import { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { getOrCreateProfile } from '@/lib/db'

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        if (user.email) {
          await getOrCreateProfile(user.email, user.name ?? '', user.image ?? '')
        }
      } catch (e) {
        console.error('Profile creation error:', e)
      }
      return true
    },
    async session({ session, token }) {
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }