// Login page with Gmail OAuth using next-auth. Clean, modern, immersive UI with white background and branding.
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Image from "next/image"

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect to home if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    })
    setLoading(false)
    if (res?.error) {
      setError("Invalid email or password")
    } else if (res?.ok) {
      router.replace("/")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8 w-full max-w-md animate-fade-in">
        <Image
          src="/next.svg"
          alt="Match Marking Logo"
          width={80}
          height={80}
          className="mb-2"
          priority
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2 text-center">
          Welcome to Match Marking
        </h1>
        <p className="text-gray-500 text-center mb-4 max-w-xs">
          Sign in to access real-time match management and immersive 3D experiences.
        </p>
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <div className="flex items-center w-full gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button
          className="flex items-center gap-3 px-6 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full justify-center"
          onClick={() => signIn("google")}
          aria-label="Sign in with Google"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.805 10.023h-9.52v3.955h5.465c-.236 1.23-1.42 3.61-5.465 3.61-3.29 0-5.98-2.72-5.98-6.06s2.69-6.06 5.98-6.06c1.87 0 3.13.8 3.85 1.49l2.63-2.56C17.13 3.7 15.13 2.7 12.805 2.7c-5.06 0-9.18 4.13-9.18 9.2s4.12 9.2 9.18 9.2c5.3 0 8.8-3.73 8.8-8.99 0-.6-.07-1.06-.16-1.49z" fill="#FFC107"></path>
            <path d="M3.545 7.68l3.27 2.4c.89-1.8 2.6-2.95 4.49-2.95 1.08 0 2.09.37 2.87 1.09l2.63-2.56C15.13 3.7 13.13 2.7 10.805 2.7c-2.98 0-5.5 1.7-6.98 4.18z" fill="#FF3D00"></path>
            <path d="M12.805 21.1c2.32 0 4.27-.77 5.7-2.09l-2.63-2.22c-.73.62-1.72.99-3.07.99-2.36 0-4.36-1.6-5.07-3.76l-3.25 2.5c1.47 2.47 4 4.08 6.98 4.08z" fill="#4CAF50"></path>
            <path d="M21.805 10.023h-9.52v3.955h5.465c-.21 1.06-.84 2.19-1.72 2.89l.01-.01 2.63 2.22c-.19.18 2.81-2.06 2.81-6.1 0-.6-.07-1.06-.16-1.49z" fill="#1976D2"></path>
          </svg>
          Sign in with Google
        </button>
        <div className="text-xs text-gray-400 mt-6 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
        <div className="w-full text-center mt-4">
          <a href="/register" className="text-blue-600 hover:underline text-sm font-medium">Don&apos;t have an account? Register</a>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  )
} 