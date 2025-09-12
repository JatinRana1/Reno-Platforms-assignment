"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react"; // ✅ import NextAuth client
import { Mail, LogIn } from "lucide-react";

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  // Submit email to request magic link (OTP)
  const onSubmitEmail = async (data) => {
    setEmail(data.email);

    const res = await signIn("email", {
      email: data.email,
      redirect: false, // stay on same page
    });

    if (!res?.error) {
      alert("Check your email for the login link ✅");
      setEmailSent(true);
    } else {
      alert("Failed to send OTP ❌");
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
              ? "Enter your email to receive a magic link"
              : `A login link has been sent to ${email}`}
          </p>
        </div>

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
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Send Login Link</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
