"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GraduationCap, MapPin, Phone, Mail, Upload, Building2, Plus } from 'lucide-react';

export default function SchoolForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const router = useRouter();
    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (key === "image" && data.image[0]) {
                formData.append("image", data.image[0]); // file object
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            const res = await fetch("/api/schools", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("School created successfully ✅");
                reset();
                router.push("/");
            } else {
                let result = await res.json()
                console.log(result.error)
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New School</h1>
                    <p className="text-gray-600 mt-2">Fill in the details to register a new school</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                        School Information
                    </h2>

                    {/* School Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <GraduationCap className="w-4 h-4 mr-1 text-gray-500" />
                            School Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter school name"
                            {...register("name", { required: true })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                        {errors.name && <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠️</span>
                            Name is required
                        </p>}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                            Address
                        </label>
                        <input
                            type="text"
                            placeholder="Street address"
                            {...register("address", { required: true })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                placeholder="City"
                                {...register("city", { required: true })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                placeholder="State"
                                {...register("state", { required: true })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-gray-500" />
                            Contact Number
                        </label>
                        <input
                            type="number"
                            placeholder="Phone number"
                            {...register("contact", { required: true, valueAsNumber: true })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-500" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="school@example.com"
                            {...register("email_id", { required: true })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <Upload className="w-4 h-4 mr-1 text-gray-500" />
                            School Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                {...register("image")}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add School</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
