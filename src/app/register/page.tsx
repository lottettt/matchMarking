'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Register() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2 text-center">
          Register
        </h1>
        <p className="text-gray-500 text-center mb-4">
          Registration coming soon. Please use the login page.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}
