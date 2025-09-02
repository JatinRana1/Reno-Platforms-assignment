"use client";

import { useEffect, useState } from "react";

export default function Cards() {
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        fetch("/api/schools")
            .then((res) => res.json())
            .then((data) => setSchools(data));
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
                <div
                    key={school.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                >
                    <img
                        src={`/uploads/${school.image}`}
                        alt={school.name}
                        className="w-full h-48 object-cover"
                    />

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
