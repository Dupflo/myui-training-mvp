import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Mentions Légales | MYUI Training",
  description:
    "Mentions légales et informations juridiques concernant MYUI Training",
}

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Mentions Légales
        </h1>
        <p className="text-muted-foreground">
          Dernière mise à jour :{" "}
          {new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-12 max-w-4xl">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            1. Informations légales
          </h2>
          <div className="space-y-4">
            <p>
              Le site web <strong>www.myui-training.com</strong> est édité par :
            </p>
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-semibold mb-2">MYUI Training SAS</p>
              <p>Société par Actions Simplifiée au capital de 10 000 €</p>
              <p>RCS Paris B 123 456 789</p>
              <p>
                Siège social : 123 Avenue des Formations, 75001 Paris, France
              </p>
              <p>N° TVA intracommunautaire : FR 12 345 678 901</p>
              <p>
                Directeur de la publication : [Nom du directeur de publication]
              </p>
              <p>Email : contact@myui-training.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            2. Hébergement
          </h2>
          <div className="space-y-4">
            <p>
              Le site web <strong>www.myui-training.com</strong> est hébergé par
              :
            </p>
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-semibold mb-2">Vercel Inc.</p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789, USA</p>
              <p>
                Site web :{" "}
                <a
                  href="https://vercel.com"
                  className="text-purple-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://vercel.com
                </a>
              </p>
            </div>

            <p className="mt-4">
              Les données de l&apos;application sont hébergées par :
            </p>
            <div className="bg-card p-6 rounded-lg border">
              <p className="font-semibold mb-2">Heroku (Salesforce)</p>
              <p>Salesforce Tower</p>
              <p>415 Mission Street, 3rd Floor</p>
              <p>San Francisco, CA 94105, USA</p>
              <p>
                Site web :{" "}
                <a
                  href="https://www.heroku.com"
                  className="text-purple-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.heroku.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            3. Propriété intellectuelle
          </h2>
          <div className="space-y-4">
            <p>
              L&apos;ensemble du contenu du site{" "}
              <strong>www.myui-training.com</strong> (illustrations, textes,
              logos, icônes, images, vidéos, etc.) est la propriété exclusive de
              MYUI Training SAS ou de ses partenaires et est protégé par les
              lois françaises et internationales relatives à la propriété
              intellectuelle.
            </p>
            <p>
              Toute reproduction totale ou partielle de ce contenu est
              strictement interdite sans autorisation préalable écrite de MYUI
              Training SAS.
            </p>
            <p>
              Les marques et logos figurant sur le site sont des marques
              déposées. Leur mention n&apos;accorde en aucune manière une
              licence ou un droit d&apos;utilisation de ces marques, qui ne
              peuvent donc être utilisées sans le consentement préalable et
              écrit du propriétaire de la marque.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            4. Protection des données personnelles
          </h2>
          <div className="space-y-4">
            <p>
              MYUI Training SAS s&apos;engage à protéger la vie privée des
              utilisateurs de son site web et à se conformer aux lois en vigueur
              sur la protection des données personnelles, notamment le Règlement
              Général sur la Protection des Données (RGPD) et la loi
              Informatique et Libertés.
            </p>
            <p>
              Les données personnelles collectées sur le site sont utilisées
              uniquement dans le cadre des finalités suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestion des inscriptions à la liste d&apos;attente</li>
              <li>Communication sur les services de MYUI Training</li>
              <li>
                Amélioration de nos services et de l&apos;expérience utilisateur
              </li>
              <li>Réponse aux demandes des utilisateurs</li>
            </ul>
            <p>
              Conformément à la réglementation en vigueur, vous disposez
              d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
              de limitation du traitement, de portabilité des données et
              d&apos;opposition au traitement de vos données personnelles. Vous
              pouvez exercer ces droits en nous contactant à l&apos;adresse
              email suivante : privacy@myui-training.com.
            </p>
            <p>
              Pour plus d&apos;informations sur la façon dont nous traitons vos
              données personnelles, veuillez consulter notre{" "}
              <Link
                href="/politique-de-confidentialite"
                className="text-purple-600 hover:underline"
              >
                Politique de Confidentialité
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            5. Cookies
          </h2>
          <div className="space-y-4">
            <p>
              Le site <strong>www.myui-training.com</strong> utilise des cookies
              pour améliorer l&apos;expérience utilisateur, analyser le trafic
              et personnaliser le contenu. En naviguant sur notre site, vous
              acceptez l&apos;utilisation de ces cookies.
            </p>
            <p>
              Vous pouvez à tout moment désactiver les cookies dans les
              paramètres de votre navigateur. Cependant, cela peut affecter
              certaines fonctionnalités du site.
            </p>
            <p>
              Pour plus d&apos;informations sur notre utilisation des cookies,
              veuillez consulter notre{" "}
              <Link
                href="/politique-de-cookies"
                className="text-purple-600 hover:underline"
              >
                Politique de Cookies
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            6. Conditions générales d&apos;utilisation
          </h2>
          <div className="space-y-4">
            <p>
              L&apos;utilisation du site <strong>www.myui-training.com</strong>{" "}
              implique l&apos;acceptation pleine et entière des conditions
              générales d&apos;utilisation décrites ci-après. Ces conditions
              d&apos;utilisation sont susceptibles d&apos;être modifiées ou
              complétées à tout moment.
            </p>
            <p>
              MYUI Training SAS s&apos;efforce de fournir des informations aussi
              précises que possible. Toutefois, elle ne pourra être tenue
              responsable des omissions, des inexactitudes et des carences dans
              la mise à jour, qu&apos;elles soient de son fait ou du fait des
              tiers partenaires qui lui fournissent ces informations.
            </p>
            <p>
              Toutes les informations indiquées sur le site sont données à titre
              indicatif, et sont susceptibles d&apos;évoluer. Par ailleurs, les
              renseignements figurant sur le site ne sont pas exhaustifs. Ils
              sont donnés sous réserve de modifications ayant été apportées
              depuis leur mise en ligne.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            7. Limitation de responsabilité
          </h2>
          <div className="space-y-4">
            <p>
              MYUI Training SAS ne pourra être tenue responsable des dommages
              directs et indirects causés au matériel de l&apos;utilisateur,
              lors de l&apos;accès au site{" "}
              <strong>www.myui-training.com</strong>, et résultant soit de
              l&apos;utilisation d&apos;un matériel ne répondant pas aux
              spécifications techniques requises, soit de l&apos;apparition
              d&apos;un bug ou d&apos;une incompatibilité.
            </p>
            <p>
              MYUI Training SAS ne pourra également être tenue responsable des
              dommages indirects (tels par exemple qu&apos;une perte de marché
              ou perte d&apos;une chance) consécutifs à l&apos;utilisation du
              site.
            </p>
            <p>
              Des espaces interactifs (possibilité de poser des questions dans
              l&apos;espace contact) sont à la disposition des utilisateurs.
              MYUI Training SAS se réserve le droit de supprimer, sans mise en
              demeure préalable, tout contenu déposé dans cet espace qui
              contreviendrait à la législation applicable en France, en
              particulier aux dispositions relatives à la protection des
              données.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            8. Droit applicable et juridiction compétente
          </h2>
          <div className="space-y-4">
            <p>
              Les présentes mentions légales et conditions d&apos;utilisation du
              site sont soumises au droit français. En cas de litige relatif à
              l&apos;interprétation ou à l&apos;exécution des présentes, les
              tribunaux français seront seuls compétents.
            </p>
            <p>
              Pour toute question relative à l&apos;application des présentes
              mentions légales ou toute demande concernant le site, vous pouvez
              nous contacter à l&apos;adresse suivante :
              legal@myui-training.com.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
