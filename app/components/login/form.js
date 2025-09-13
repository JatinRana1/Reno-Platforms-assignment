"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, LogIn, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Send OTP
  const onSubmitEmail = async (data) => {
    setLoading(true);
    setEmail(data.email);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    setLoading(false);

    if (res.ok) {
      setEmailSent(true);
    } else {
      alert("❌ Failed to send OTP");
    }
  };


  const onSubmitOTP = async (data) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      const result = await res.json();

      if (res.ok) {
        // ✅ Now sign in with NextAuth credentials provider
        const loginRes = await signIn("credentials", {
          email,
          otp: data.otp,
          redirect: false,
        });

        if (loginRes?.error) {
          alert("❌ Failed to login");
        }else {
          router.push('/');
        }
      } else {
        alert(result.message || "❌ Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while verifying OTP");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600 mt-2">
            {!emailSent
              ? "Enter your email to receive a login OTP"
              : `We sent a code to ${email}`}
          </p>
        </div>

        {/* Email Form */}
        {!emailSent && (
          <form
            onSubmit={handleSubmit(onSubmitEmail)}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-1 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  Email is required
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2
                ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                }`}
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Send OTP</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Form */}
        {emailSent && (
          <form
            onSubmit={handleSubmit(onSubmitOTP)}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <KeyRound className="w-4 h-4 mr-1 text-gray-500" />
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                {...register("otp", { required: true })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-center tracking-widest"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  OTP is required
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-5 h-5" />
              <span>Verify OTP</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
