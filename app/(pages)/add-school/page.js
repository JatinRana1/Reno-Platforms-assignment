import SchoolForm from '@/app/components/add-school/form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const AddSchool = async () => {
  const session = await getServerSession(authOptions)
  if(!session) {
    console.log('redirecting to login')
    redirect("/login");
  }
  return (
    <section>
        <SchoolForm/>
    </section>
  )
}
export default AddSchool