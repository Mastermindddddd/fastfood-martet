"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setUserCreated(true);
      setEmail("");
      setPassword("");
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
          Create an Account
        </h1>

        {userCreated && (
          <div className="my-4 text-center p-3 bg-green-50 text-green-700 rounded-md">
            🎉 User created successfully! <br />
            Now you can{" "}
            <Link className="underline font-semibold" href={"/login"}>
              Login &raquo;
            </Link>
          </div>
        )}
        {error && (
          <div className="my-4 text-center p-3 bg-red-50 text-red-700 rounded-md">
            ❌ An error has occurred. <br /> Please try again later.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={creatingUser}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={creatingUser}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={creatingUser}
            className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-md ${
              creatingUser ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {creatingUser ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-2 relative z-10">or continue with</span>
          <div className="absolute left-0 right-0 top-1/2 border-t border-gray-300 -z-0"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-300"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          <span className="font-medium text-slate-700">Continue with Google</span>
        </button>

        <div className="text-center mt-6 text-slate-600">
          Already have an account?{" "}
          <Link className="text-orange-600 font-semibold underline" href={"/login"}>
            Login here &raquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
