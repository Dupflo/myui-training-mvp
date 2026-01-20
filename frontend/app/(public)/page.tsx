import CtaProgramCard from "@/components/cta-card-program"
import FeatureCard from "@/components/feature-card"
import BrevoIcon from "@/components/icons/brevo.svg"
import NotionIcon from "@/components/icons/notion.svg"
import IntegrationCard from "@/components/integration-card"
import Navbar from "@/components/navbar"
import ProgramCard from "@/components/program-card"
import { Button } from "@/components/ui/button"
import WaitlistForm from "@/components/waitlist-form"
import { fetchCMS } from "@/utils/fetchers"
import {
  ArrowRight,
  CheckCircle,
  Laptop,
  LineChart,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const landings = await fetchCMS({
    path: "landing-pages",
    tags: ["landing-pages"],
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Créez et vendez vos formations en ligne{" "}
            <span className="text-amber-500">sans effort</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            La plateforme tout-en-un pour les créateurs de contenu qui
            souhaitent concevoir, vendre et gérer leurs programmes de formation
            avec un maximum de conversions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#waitlist">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-xl"
              >
                Rejoindre la liste d&apos;attente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl"
              >
                En savoir plus
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Accès prioritaire à la version bêta</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MYUI Training vous offre les outils nécessaires pour créer, vendre
            et gérer vos formations en ligne.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Laptop className="h-10 w-10 text-amber-500" />}
            title="Création intuitive"
            description="Concevez vos programmes de formation et doter vos adhérents d'une interface intuitive optimisée pour ordinateur et mobile."
          />
          <FeatureCard
            icon={<ShoppingCart className="h-10 w-10 text-amber-500" />}
            title="Pages de vente optimisées"
            description="Créez des pages de vente attrayantes qui convertissent vos visiteurs en clients."
          />
          <FeatureCard
            icon={<LineChart className="h-10 w-10 text-amber-500" />}
            title="Processus d'achat optimisé"
            description="Un tunnel de vente conçu par des experts en copywriting pour maximiser vos conversions."
          />
        </div>
      </section>

      {/* Latest Programs Section */}
      <section id="programs" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Les derniers programmes publiés sur la plateforme
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les formations créées par nos utilisateurs pionniers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {landings?.map((program: any) => (
            <ProgramCard
              key={program.id}
              title={program.title}
              description={program.description}
              imageUrl={program.coverImage?.url}
              author="KD Training"
              price={program.price}
              category="Sport & bien-être"
              popular={true}
              link={`/${program.slug}`}
            />
          ))}
          <CtaProgramCard />
        </div>

        {/* <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-xl">
            Voir tous les programmes
          </Button>
        </div> */}
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intégrations puissantes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connectez MYUI Training à vos outils préférés pour une expérience
              fluide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <IntegrationCard
              name="Brevo"
              description="Synchronisez vos contacts et automatisez vos campagnes email pour capturer plus de leads."
              image={BrevoIcon}
            />
            <IntegrationCard
              name="Notion"
              description="Créez des pages de vente optimisées directement depuis vos documents Notion."
              image={NotionIcon}
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-slate-800 text-white p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">
                Rejoignez la liste d&apos;attente
              </h2>
              <p className="text-amber-100 mb-6">
                MYUI Training est actuellement en phase bêta. Inscrivez-vous dès
                maintenant pour être parmi les premiers à y accéder.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-1 text-amber-200" />
                  <span>Accès prioritaire à la version bêta</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-1 text-amber-200" />
                  <span>Remise spéciale pour les premiers utilisateurs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-1 text-amber-200" />
                  <span>Support personnalisé pour démarrer</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
