import { Header } from "@/components/media/header"
import { Footer } from "@/components/media/footer"
import { LiveTicker } from "@/components/media/live-ticker"
import { ArticleCard } from "@/components/media/article-card"
import { SectionTitle } from "@/components/media/section-title"

const liveTickerItems = [
  {
    id: "1",
    title: "Le sommet international sur le climat s'ouvre aujourd'hui à Etheria City",
    time: "Il y a 5 min",
    href: "/article/sommet-climat",
  },
  {
    id: "2",
    title: "L'équipe nationale remporte une victoire historique en finale",
    time: "Il y a 12 min",
    href: "/article/victoire-finale",
  },
  {
    id: "3",
    title: "Nouvelle découverte archéologique dans les montagnes du Nord",
    time: "Il y a 25 min",
    href: "/article/decouverte-archeologique",
  },
  {
    id: "4",
    title: "Les marchés financiers en hausse après l'annonce de la banque centrale",
    time: "Il y a 38 min",
    href: "/article/marches-financiers",
  },
]

const featuredArticle = {
  title: "Réforme historique : le Parlement adopte la nouvelle loi sur la transition énergétique",
  excerpt: "Après des mois de débats, les députés ont voté à une large majorité cette réforme qui promet de transformer le paysage énergétique du pays d'ici 2035.",
  category: "Politique",
  image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop",
  date: "Il y a 2 heures",
  href: "/article/reforme-energie",
}

const topArticles = [
  {
    title: "« C'est un tournant majeur » : les réactions politiques après le vote historique",
    category: "Politique",
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=250&fit=crop",
    date: "Il y a 3 heures",
    href: "/article/reactions-politiques",
  },
  {
    title: "Économie : les entreprises locales s'adaptent aux nouvelles normes environnementales",
    category: "Économie",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/article/entreprises-environnement",
  },
  {
    title: "Festival d'été : plus de 100 000 visiteurs attendus ce week-end à Etheria",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/article/festival-ete",
  },
]

const politicsArticles = [
  {
    title: "Municipales 2026 : les premiers résultats tombent dans les grandes villes",
    excerpt: "Les bureaux de vote ont fermé leurs portes à 20h. Voici les tendances qui se dégagent.",
    category: "Politique",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: "/article/municipales-resultats",
  },
  {
    title: "Le Premier ministre annonce un remaniement gouvernemental imminent",
    category: "Politique",
    image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/article/remaniement",
  },
  {
    title: "Débat à l'Assemblée : la question du pouvoir d'achat divise la majorité",
    category: "Politique",
    date: "Il y a 8 heures",
    href: "/article/debat-pouvoir-achat",
  },
  {
    title: "Sondage exclusif : la confiance des citoyens envers les institutions en hausse",
    category: "Politique",
    date: "Hier",
    href: "/article/sondage-confiance",
  },
]

const internationalArticles = [
  {
    title: "Tensions diplomatiques : le sommet entre les deux puissances reporté",
    excerpt: "Les négociations ont été interrompues après un désaccord sur les conditions préalables.",
    category: "International",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/article/tensions-diplomatiques",
  },
  {
    title: "Crise humanitaire : l'ONU lance un appel d'urgence pour les réfugiés",
    category: "International",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/article/crise-humanitaire",
  },
  {
    title: "Accord commercial historique signé entre trois nations",
    category: "International",
    date: "Il y a 7 heures",
    href: "/article/accord-commercial",
  },
]

const sportsArticles = [
  {
    title: "Football : le club local décroche son billet pour la coupe continentale",
    category: "Sport",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: "/article/football-coupe",
  },
  {
    title: "Tennis : la révélation nationale atteint les quarts de finale du Grand Chelem",
    category: "Sport",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop",
    date: "Il y a 3 heures",
    href: "/article/tennis-quarts",
  },
  {
    title: "JO 2028 : les athlètes nationaux en pleine préparation intensive",
    category: "Sport",
    date: "Il y a 5 heures",
    href: "/article/jo-preparation",
  },
  {
    title: "Cyclisme : le champion défend son titre sur le tour national",
    category: "Sport",
    date: "Hier",
    href: "/article/cyclisme-tour",
  },
]

const cultureArticles = [
  {
    title: "Cinéma : le nouveau film du réalisateur primé fait sensation au festival",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/article/cinema-festival",
  },
  {
    title: "Exposition exceptionnelle : les chefs-d'œuvre de la Renaissance au musée national",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/article/exposition-renaissance",
  },
  {
    title: "Littérature : le lauréat du prix national dévoile son prochain roman",
    category: "Culture",
    date: "Hier",
    href: "/article/litterature-prix",
  },
]

const opinionArticles = [
  {
    title: "Éditorial : Pourquoi cette réforme énergétique est une nécessité absolue",
    author: "Marie Dupont",
    date: "Il y a 3 heures",
    href: "/article/editorial-energie",
  },
  {
    title: "Tribune : L'éducation, pilier de notre avenir commun",
    author: "Jean-Pierre Martin",
    date: "Il y a 8 heures",
    href: "/article/tribune-education",
  },
  {
    title: "Chronique : Les défis de la transformation numérique pour nos entreprises",
    author: "Sophie Bernard",
    date: "Hier",
    href: "/article/chronique-numerique",
  },
]

const mostReadArticles = [
  {
    title: "Réforme historique : le Parlement adopte la nouvelle loi sur la transition énergétique",
    date: "Il y a 2 heures",
    href: "/article/reforme-energie",
  },
  {
    title: "Le Premier ministre annonce un remaniement gouvernemental imminent",
    date: "Il y a 6 heures",
    href: "/article/remaniement",
  },
  {
    title: "Football : le club local décroche son billet pour la coupe continentale",
    date: "Il y a 1 heure",
    href: "/article/football-coupe",
  },
  {
    title: "Tensions diplomatiques : le sommet entre les deux puissances reporté",
    date: "Il y a 2 heures",
    href: "/article/tensions-diplomatiques",
  },
  {
    title: "Cinéma : le nouveau film du réalisateur primé fait sensation au festival",
    date: "Il y a 2 heures",
    href: "/article/cinema-festival",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LiveTicker items={liveTickerItems} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <ArticleCard
                {...featuredArticle}
                variant="featured"
                categoryColor="bg-primary"
              />
            </div>
            
            {/* Top Articles Sidebar */}
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <ArticleCard
                  key={index}
                  {...article}
                  variant="horizontal"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main articles */}
            <div className="lg:col-span-2 space-y-10">
              {/* Politics Section */}
              <div>
                <SectionTitle title="Politique" href="/politique" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ArticleCard {...politicsArticles[0]} variant="vertical" />
                  <ArticleCard {...politicsArticles[1]} variant="vertical" />
                </div>
                <div className="mt-4 divide-y divide-border border-t border-border">
                  {politicsArticles.slice(2).map((article, index) => (
                    <div key={index} className="py-3">
                      <ArticleCard
                        {...article}
                        variant="compact"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* International Section */}
              <div>
                <SectionTitle title="International" href="/international" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ArticleCard {...internationalArticles[0]} variant="vertical" />
                  <div className="space-y-4">
                    <ArticleCard {...internationalArticles[1]} variant="horizontal" />
                    <ArticleCard {...internationalArticles[2]} variant="compact" />
                  </div>
                </div>
              </div>

              {/* Sports Section */}
              <div>
                <SectionTitle title="Sport" href="/sport" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sportsArticles.slice(0, 2).map((article, index) => (
                    <ArticleCard key={index} {...article} variant="vertical" />
                  ))}
                </div>
                <div className="mt-4 divide-y divide-border border-t border-border">
                  {sportsArticles.slice(2).map((article, index) => (
                    <div key={index} className="py-3">
                      <ArticleCard {...article} variant="compact" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Culture Section */}
              <div>
                <SectionTitle title="Culture" href="/culture" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cultureArticles.map((article, index) => (
                    <ArticleCard 
                      key={index} 
                      {...article} 
                      variant={index === 2 ? "compact" : "vertical"} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Most Read */}
              <div className="bg-muted p-4 rounded-sm">
                <SectionTitle title="Les plus lus" />
                <div className="space-y-0">
                  {mostReadArticles.map((article, index) => (
                    <div key={index} className="flex gap-3 py-3 border-b border-border last:border-b-0">
                      <span className="font-serif text-2xl font-bold text-primary/30">
                        {index + 1}
                      </span>
                      <ArticleCard
                        {...article}
                        variant="compact"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Opinion */}
              <div>
                <SectionTitle title="Opinions" href="/opinions" />
                <div className="space-y-4">
                  {opinionArticles.map((article, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <ArticleCard
                        {...article}
                        variant="compact"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-primary text-primary-foreground p-6 rounded-sm">
                <h3 className="font-serif text-lg font-bold mb-2">
                  Restez informé
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  Recevez chaque matin l&apos;essentiel de l&apos;actualité dans votre boîte mail.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="w-full px-3 py-2 text-sm bg-background text-foreground rounded-sm placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-sm font-medium bg-background text-foreground rounded-sm hover:bg-background/90 transition-colors"
                  >
                    S&apos;inscrire à la newsletter
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
