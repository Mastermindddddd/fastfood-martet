"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
    setLoginInProgress(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            disabled={loginInProgress}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            disabled={loginInProgress}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
          />
          <button
            disabled={loginInProgress}
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-md ${
              loginInProgress ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loginInProgress ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-2 relative z-10">or continue with</span>
          <div className="absolute left-0 right-0 top-1/2 border-t border-gray-300 -z-0"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-300"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          <span className="font-medium text-slate-700">Continue with Google</span>
        </button>

        <div className="text-center mt-6 text-slate-600">
          Don’t have an account?{" "}
          <Link className="text-orange-600 font-semibold underline" href={"/register"}>
            Register here &raquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
