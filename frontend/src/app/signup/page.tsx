"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/utils/api";
import Header from "@/components/Header";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isFormValid = name.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return; 

    try {
       await signUpUser(name, email, password);
      toast.success("Signup successful. Please login.");
    
      router.push(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <>
    <Header/>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
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
            Signup
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login Instead</a>
        </p>
      </div>
    </div>
    </>
  );
}
