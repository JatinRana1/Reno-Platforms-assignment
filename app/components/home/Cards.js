"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react"; // optional icon for edit button
import { useSession } from 'next-auth/react';

export default function Cards() {
    const { data: session } = useSession();
    const [schools, setSchools] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/schools")
            .then((res) => res.json())
            .then((data) => setSchools(data))
            .catch((err) => console.error(err));
    }, []);

    const handleEdit = (id) => {
        router.push(`/edit-school/${id}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools?.map((school) => (
                <div
                    key={school.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 relative"
                >
                    <img
                        src={school.image}
                        alt={school.name}
                        className="w-full h-48 object-cover"
                    />

                    {/* Edit Button */}
                    {session && (
                        <button
                            onClick={() => handleEdit(school.id)}
                            className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition cursor-pointer"
                            title="Edit School"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">{school.name}</h2>
                        <p className="text-gray-600">
                            {school.address}, {school.city}, {school.state}
                        </p>
                        <p className="text-gray-600">📞 {school.contact}</p>
                        <p className="text-gray-600">✉️ {school.email_id}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
