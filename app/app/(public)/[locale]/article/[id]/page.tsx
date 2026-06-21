import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Eye, Share2 } from "lucide-react";

import { Header } from "@/components/media/header";
import { Footer } from "@/components/media/footer";
import { ArticleCard } from "@/components/media/article-card";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  views: number;
}

const articles: Record<string, Article> = {
  "1": {
    id: "1",
    title: "Réforme historique : le Parlement adopte la nouvelle loi sur la transition énergétique",
    excerpt:
      "Après des mois de débats, les diputados ont votado à une large majorité cette réforme qui promet de transformer le paysage énergétique du pays d'ici 2035.",
    content: `Après des mois de débats intenses, le Parlement a adopté ce mardi la nouvelle loi sur la transition énergétique. Cette réforme historique, présentée par le ministre de la Transition écologique, prévoit un ensemble de mesures visant à réduire les émissions de gaz à effet de serre de 40% d'ici 2030.

Le texte a été approuvé par 312 voix contre 187, recueillir le soutien de la majorité ainsi que d'une partie de l'opposition. « C'est une victoire pour notre planète et pour les générations futures », a déclaré le ministre lors de la conférence de presse suivant le vote.

Les principales mesures de cette loi incluent :

- L'interdiction progressive des véhicules à combustibles fossiles d'ici 2035
- Le renforcement des normes d'isolation pour les bâtiments neufs
- La création d'un fonds d'investissement de 10 milliards d'euros pour les énergies renouvelables
- La mise en place d'un dispositif d'aide pour la rénovation énergétique des logements

Les filières industrielles concernés ont dès maintenant commencé à s'adapter. Les constructors automobiles ont promis des véhicules 100% électriques d'ici 2030, tandis que le secteur du bâtiment accélère sa transition vers des matériaux plus durables.

Cette réforme s'inscrit dans le cadre des engagements pris par le pays lors de la Cop26 à Glasgow. Elle devrait permettre de réduire significativement l'empreinte carbone nationale et de créer des milliers d'emplois dans les secteurs verts.`,
    category: "Politique",
    author: "Marie Dupont",
    date: "Il y a 2 heures",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop",
    views: 15420,
  },
  "2": {
    id: "2",
    title: "Victoire historique de l'équipe nationale en finale du championnat",
    excerpt: "Une performance exceptionnelle qui restera dans les annales du sport français...",
    content: `L'équipe de France de football a écrit une nouvelle page de son histoire en devenant championne du monde pour la troisième fois. La finale, joué au Stade de France devant 80 000 spectateurs, a vu les Bleus s'imposer face à l'Italie sur le score de 3-1.

Les buts de Mbappé, Benzema et Dembélé ont offert à la France un succès mémorable. Le captain Hugo Lloris a également réalisé plusieurs arrêts décisifs qui ont permis de maintenir l'avantage malgré la pression italienne.

« C'est le couronnement d'une saison exceptionnelle », a déclaré le sélectionneur en conférence de presse. « Les joueurs ont montré un mental d'acier et une qualité de jeu remarquable. »

Cette victoire est la première depuis 2018 et la deuxième à domicile après celle de 1998. Les supporters français ont envahi les streets de Paris pour célébrer ce troisième titre historique.`,
    category: "Sport",
    author: "Thomas Martin",
    date: "Il y a 3 heures",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=675&fit=crop",
    views: 28750,
  },
  "3": {
    id: "3",
    title: "Tensions diplomatiques : les négociations reprennent à Genève",
    excerpt: "Après plusieurs semaines de blocage, les discussions ont enfin repris...",
    content: `Les négociations entre les deux grandes puissances ont repris ce lundi à Genève après plusieurs semaines de suspension. Cette reprise survient alors que les tensions diplomatiques mencapaiient leur paroxysme ces derniers mois.

Les délégations, conduites par lesministres des Affaires étrangères de chaque pays, se sont retrouvées autour de la table des négociations pour aborder les sujets brûlants du moment : le commerce international, la coopération climatique et la sécurité régionale.

« Nous sommes déterminés à trouver des solutions constructives », a déclaré le chef de la délégation française à l'issue de la première journée de négociations. Les observateurs remain optimistes quant à une possible entente avant la fin de l'année.

Cette reprise des discussions intervient dans un contexte marqué par une montée des tensions dans plusieurs régions du monde. Les marchés financiers ont immédiatement réagir positivement à cette nouvelle, les indices boursiers ayant progressé de 1,5% dans la journée.`,
    category: "International",
    author: "Pierre Moreau",
    date: "Il y a 4 heures",
    image: "https://images.unsplash.com/photo-1524522173746-f628baad3644?w=1200&h=675&fit=crop",
    views: 12300,
  },
  "4": {
    id: "4",
    title: "Innovation : une startup française révolutionne le secteur de l'énergie",
    excerpt: "Cette jeune pousse a développé une technologie de stockage révolutionnaire...",
    content: `Une startup française basée à Lyon a développé une technologie de stockage d'énergie qui pourrait transformer le secteur des énergies renouvelables. Cette innovation permet de stocker l'énergie solaire et éolienne de manière beaucoup plus efficace que les batteries actuelles.

Fondée il y a trois ans par deux ingénieurs du CNRS, la société a déjà séduit plusieurs investisseurs majeurs. « Notre technologie permet de multiplier par trois la capacité de stockage des systèmes actuels », explique le PDG.

Les applications sont multiples : stockage domestique pour les particuliers, installations industrielles, voire réseaux électriques entiers. Plusieurs municipalités ont déjà manifester leur intérêt pour équiper leurs infrastructures.

Cette avancée technologique positionne la France comme leader européen dans le domaine du stockage d'énergie. Le gouvernement a d'ailleurs annoncé un plan d'investissement de 500 millions d'euros pour soutenir ce type d'innovation.`,
    category: "Économie",
    author: "Julie Bernard",
    date: "Il y a 5 heures",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=675&fit=crop",
    views: 9840,
  },
  "5": {
    id: "5",
    title: "Météo : vague de chaleur exceptionnelle attendue cette semaine",
    excerpt: "Les températures pourraient atteindre des records dans plusieurs régions...",
    content: `Météo France a annoncé une vague de chaleur exceptionnelle pour cette semaine, avec des températures pouvant atteindre 42°C dans certaines régions du sud. Cette canicule précoc est due à une masse d'air chaud en provenance d'Afrique du Nord.

Les autorités ont déclenché le plan canicule de niveau 3 dans plusieurs départements. Les recommandations habituelles sont再度 rappelées : s'hydrater régulièrement, éviter les expositions au soleil aux heures les plus chaudes, et Porter une attention particulière aux personnes vulnérables.

Les hôpitaux se prepared à accueillir un afflux de patients liés à la chaleur. Les associations caritatives ont également renforcé leurs dispositifs d'aide aux sans-abri.

Cette vague de chaleur devrait durer au moins jusqu'au week-end, avant l'arrivée d'un front orageux par l'ouest qui pourrait apporter un soulagement.`,
    category: "Société",
    author: "Marc Leroy",
    date: "Hier",
    image: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=1200&h=675&fit=crop",
    views: 12300,
  },
  "6": {
    id: "6",
    title: "Le festival de cinéma dévoiler sa sélection officielle",
    excerpt: "Cette année, 24 films seront en compétition pour la prestigieuse récompense...",
    content: `Le festival de cinéma a étabouri sa sélection officielle pour cette édition 2026. Pas moins de 24 films seront en compétition pour la Palme d'or, dont plusieurs réalisations françaises et européennes.

La sélection inclut des œuvresvenues du monde entier : États-Unis, Japon, Brésil, Allemagne, Italie et bien sûr France. Le jury, présidé par une personnalité du cinéma international, aura la tâche difficile de départager ces étabouriences cinématographiques.

Plusieurs films attendus figura bien dans la sélection, notamment le dernier opus d'un réalisateur célébration et le premier long métrage d'un jeune promesses du cinéma d'auteur.

Le festival étabourira également des séances spéciales, des masterclasses et des rencontres avec les équipes des films. Les billets seront mis en vente dès la semaine prochaine.`,
    category: "Culture",
    author: "Sophie Laurent",
    date: "Hier",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
    views: 5200,
  },
  "7": {
    id: "7",
    title: "La nouvelle exposition au Musée d'Art Moderne fait sensation",
    excerpt: "Plus de 10 000 visiteurs ont déjà découvert cette rétrospective unique...",
    content: `Le Musée d'Art Moderne a inauguré hier sa nouvelle exposition dédiée à l'art contemporain. En une semaine seulement, plus de 10 000 visiteurs ont déjà incontourn la rétrospective qui regroupe plus de 200 œuvres provenant de collections privées et musées du monde entier.

L'exposition présente le travail de plusieurs artistes majeurs du XXe siècle, dont certaines œuvres n'avaient encore jamais été exposées en France. Le parcours muséographique a été conçu pour offrir une expérience immersive unique aux visiteurs.

« C'est une opportunité exceptionnelle de thérapeut ces chefs-d'œuvre ensemble », a déclaré le directeur du musée. « Nous avons travaillé pendant deux ans pour montée cette exposition. »

Les billets pour les prochaine semaines sont déjà quasi complets. Le musée a décider d'étendre ses horaires d'ouverture pour thérapeut davantage de visiteurs.`,
    category: "Culture",
    author: "Sophie Laurent",
    date: "Il y a 2 jours",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=1200&h=675&fit=crop",
    views: 8700,
  },
  "8": {
    id: "8",
    title: "Interview exclusive avec le nouveau directeur de la Banque Centrale",
    excerpt: "Il nous livre sa vision pour les années à venir et les défis à relever...",
    content: `Le nouveau directeur de la Banque Centrale a accordé sa première interview depuis sa nomination. Il a abordé les grands enjeux économiques des prochaines années et détaillé sa vision pour la politique monétaire.

« Notre priorité sera de thérapeut l'inflation tout en soutenant la croissance économique », a-t-il déclaré. « C'est un équilibre délicat mais nécessaire. »

Il a également évoquer les défis liés à la transition numérique du secteur bancaire et les enjeux de la finance verte. « Les banques devront jouer un rôle central dans le financement de la transition écologique », a-t-il ajouté.

Cette interview survient quelques jours après la présentation du nouveau programme économique du gouvernement, qui mise notamment sur les investissements dans les secteurs stratégiques.`,
    category: "Économie",
    author: "Marie Dupont",
    date: "Il y a 2 jours",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=675&fit=crop",
    views: 9200,
  },
};

const relatedArticles = [
  {
    id: "2",
    title: "Victoire historique de l'équipe nationale en finale du championnat",
    category: "Sport",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=250&fit=crop",
    date: "Il y a 3 heures",
    href: "/article/2",
  },
  {
    id: "4",
    title: "Innovation : une startup française révolutionne le secteur de l'énergie",
    category: "Économie",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/article/4",
  },
  {
    id: "6",
    title: "Le festival de cinéma dévoiler sa sélection officielle",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/article/6",
  },
];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(articles).map((id) => ({
      locale,
      id,
    }))
  );
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const article = articles[id];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <Button asChild>
              <Link href="/article">Retour aux articles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Link */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/article">
                <ArrowLeft className="h-4 w-4" />
                Retour aux articles
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-primary">{article.category}</span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.views.toLocaleString()} vues</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {article.content.split("\n").map((paragraph, index) =>
              paragraph ? (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 border-t border-b border-border py-4 mb-12">
            <span className="text-sm font-medium">Partager :</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="bg-muted/30 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold mb-6">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} {...related} variant="vertical" />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
