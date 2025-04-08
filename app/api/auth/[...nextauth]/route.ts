import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you would typically check against your database
        // Since we don't want sign-up, we'll use hardcoded credentials
        if (
          (credentials?.username === "admin" && credentials?.password === "password") ||
          (credentials?.username === "biruk" && credentials?.password === "password")
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  // Add a secret key for JWT signing
  secret: process.env.NEXTAUTH_SECRET || "YOUR_SECRET_KEY_HERE",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
