import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/(auth)/actions/auth"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil de l&apos;utilisateur</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Prénom
          </label>
          <p className="text-gray-900">{user.firstname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nom
          </label>
          <p className="text-gray-900">{user.lastname}</p>
        </div>
        {/* Ajoutez d'autres champs d'information utilisateur ici */}
      </div>
    </div>
  )
}
