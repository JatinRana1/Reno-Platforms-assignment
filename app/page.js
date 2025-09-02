import React from 'react'
import Link from 'next/link'
import Cards from './components/home/Cards'
import { Plus } from 'lucide-react';

const ShowSchools = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
            Schools
          </h1>

          <div className="mb-8">
            <Link
              href='/add-school'
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Schools</span>
            </Link>
          </div>

          <Cards />
        </div>
      </div>
    </div>
  )
}

export default ShowSchools