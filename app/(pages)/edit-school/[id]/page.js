import React from 'react';
import EditForm from '@/app/components/edit-school/Form';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const EditSchool = async ({ params }) => {
    const { id } = params;
    // console.log("Editing school ID:", id);
    const session = await getServerSession(authOptions)
    if (!session) {
        console.log('redirecting to login')
        redirect("/login");
    }
    return (
        <div>
            <EditForm schoolId={id} />
        </div>
    );
};

export default EditSchool;
