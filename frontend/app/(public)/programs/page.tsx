import { getCurrentUser, signOut } from "@/app/(auth)/actions/auth"
import Card, { CardProps } from "@/components/card"
import Logo from "@/components/logo.png"
import { fetchCMS } from "@/utils/fetchers"
import Image from "next/image"

export default async function Home() {
  const user = await getCurrentUser()
  const programs = await fetchCMS({ path: "programs" })

  return (
    <section className="space-y-10">
      <Image
        src={Logo}
        alt="logo"
        className="mx-auto w-60 md:w-72"
        quality={100}
        draggable={false}
      />
      <h1 className="text-2xl md:text-4xl font-bold text-center ">
        Découvrez nos programmes
      </h1>
      <p className="text-center text-xl md:text-2xl font-medium">
        <b> MYUI Training</b> est une plateforme dédiée à l&apos;apprentissage
        et au développement des compétences, offrant des programmes variés pour
        tous les niveaux.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-20 py-10">
        {programs.map((program: CardProps) => (
          <Card key={program.documentId} data={program} />
        ))}
      </div>{" "}
      {user && (
        <div className="text-center">
          <hr className="mb-5" />
          <p>
            Vous êtes connecté en tant que <b>{user.username}</b>{" "}
          </p>
          {user.programs.length === 0 && (
            <p>Vous devez détenir un programme pour aller plus loin</p>
          )}
          <button onClick={signOut} className="ml-4 text-blue-500">
            Se déconnecter
          </button>
        </div>
      )}
    </section>
  )
}
