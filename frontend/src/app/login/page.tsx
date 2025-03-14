"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/utils/api";
import Header from "@/components/Header";
import { Toaster, toast } from "react-hot-toast";

function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState(searchParams.get("password") || "");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await loginUser(email, password);
      localStorage.setItem("authToken", response.token);

      toast.success(response.message || "Login successful. Redirecting to products page...");

      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <button
              type="submit"
              className={`w-full py-2 rounded ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              Login
            </button>
          </form>
          <p className="text-sm mt-4 text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Signup Instead
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
