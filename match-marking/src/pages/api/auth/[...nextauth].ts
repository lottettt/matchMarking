// NextAuth API route for handling authentication with Gmail OAuth (Google provider)
// See: https://next-auth.js.org/getting-started/introduction
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock admin account
        if (credentials?.email === "admin@gmail.com" && credentials?.password === "admin") {
          return { id: "99", name: "Admin User", email: "admin", role: "admin" }
        }
        // Mock regular user account
        if (credentials?.email === "user@gmail.com" && credentials?.password === "user") {
          return { id: "1", name: "Test User", email: "user", role: "user" }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
}) 