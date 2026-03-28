import { Locale, isValidLocale, defaultLocale } from "@/lib/locale";
import { Header } from "@/components/media/header";
import { Footer } from "@/components/media/footer";
import { ArticleCard } from "@/components/media/article-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articlesApi } from "@/lib/api/client";
import type { HomepageArticlesResponse } from "@/lib/api/types";
import {
  ChevronRight,
  Clock,
  Rocket,
  Orbit,
  Satellite,
  Telescope,
  Atom,
  Globe,
  Star,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Rocket, count: 456 },
  { name: "Exploration", icon: Orbit, count: 134 },
  { name: "Sondes", icon: Satellite, count: 98 },
  { name: "Astronomie", icon: Telescope, count: 112 },
  { name: "Science", icon: Atom, count: 67 },
  { name: "Planètes", icon: Globe, count: 45 },
];

const mockFeaturedArticle = {
  title: "Artemis III : la NASA annonce la date du retour sur la Lune",
  excerpt:
    "La mission habitée devrait poser ses pieds lunaires d'ici 18 mois, avec un équipage historique.",
  category: "Exploration",
  image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/espace/article/artemis-iii-date",
};

const mockEspaceArticles = [
  {
    title: "James Webb : une exoplanète habitable découverte",
    excerpt:
      "Le télescope spatial révèle des signes encourageants dans une système à 40 années-lumière.",
    category: "Astronomie",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/espace/article/exoplanete-habitable",
  },
  {
    title: "SpaceX Starship : vol orbital réussi",
    excerpt: "Le méga-lanceur a accompli sa mission avant un retour contrôlé.",
    category: "Exploration",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/espace/article/starship-orbital",
  },
  {
    title: "Mars : de l'eau liquide confirmée sous la surface",
    excerpt: "Des scientifiques révèlent une découverte majeure pour la recherche de vie.",
    category: "Planètes",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/espace/article/mars-eau",
  },
  {
    title: "ESA : nouvelle mission vers les astéroïdes",
    excerpt: "Un voyage de six ans vers une cible riche en ressources.",
    category: "Sondes",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/espace/article/esa-asteroides",
  },
  {
    title: "Station spatiale chinoise : record de durée",
    excerpt: "Les taïkonautes battent un record de séjour en orbite.",
    category: "Exploration",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/espace/article/tiangong-record",
  },
  {
    title: "Satellite images reveal new craters on Moon",
    excerpt: "Des images haute résolution révèlent l'activité géologique lunaire.",
    category: "Planètes",
    image: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/espace/article/lune-crateres",
  },
  {
    title: "Pluie d'étoiles filantes : spectacle ce week-end",
    excerpt: "Les Perséides promettent un show céleste spectaculaire.",
    category: "Astronomie",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/espace/article/perséides",
  },
  {
    title: "Ariane 6 : premiers lancements opérationnels",
    excerpt: "Le lanceur européen entame sa carrière commerciale avec succès.",
    category: "Exploration",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/espace/article/ariane-6",
  },
];

const mockTrendingArticles = [
  {
    title: "Éclipse solaire : où l'observer",
    date: "Dans 3 jours",
    href: "/espace/article/eclipse",
  },
  {
    title: "Chronologie de la conquête spatiale",
    date: "Mis à jour",
    href: "/espace/article/chronologie",
  },
  {
    title: "Vols habités : le calendrier 2026",
    date: "Il y a 3 heures",
    href: "/espace/article/calendrier-2026",
  },
  {
    title: "Observer les planètes ce mois",
    date: "Hier",
    href: "/espace/article/planetes-mois",
  },
  {
    title: "Podcast : les secrets de l'Univers",
    date: "Il y a 2 jours",
    href: "/espace/article/podcast-univers",
  },
];

async function getEspaceArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch espace articles:", error);
  }
  return null;
}

function articleToCardProps(article: {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  categoryId?: string;
  viewCount?: number;
  readTime?: number;
  imageUrl?: string;
}) {
  return {
    title: article.title,
    excerpt: article.excerpt,
    category: article.categoryId
      ? article.categoryId.charAt(0).toUpperCase() + article.categoryId.slice(1).replace(/-/g, " ")
      : "Espace",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/espace/article/${article.slug}`,
  };
}

function mergeWithMock<T extends { title: string }>(
  realArticles: T[] | undefined,
  mockArticles: T[],
  maxCount?: number
): T[] {
  const targetCount = maxCount || mockArticles.length;

  if (!realArticles || realArticles.length === 0) {
    return mockArticles.slice(0, targetCount);
  }

  const realCount = Math.min(realArticles.length, targetCount);
  const mockNeeded = targetCount - realCount;

  return [...realArticles.slice(0, realCount), ...mockArticles.slice(0, mockNeeded)];
}

export default async function EspacePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getEspaceArticles(locale);

  const espaceArticles = mergeWithMock(
    homepageData?.sections?.espace?.map(articleToCardProps),
    mockEspaceArticles
  );

  const featured = homepageData?.featured
    ? articleToCardProps(homepageData.featured)
    : mockFeaturedArticle;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <a href={`/${locale}`} className="hover:text-foreground">
                Accueil
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Espace</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Espace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités spatiales, exploration, astronomie et dernières découvertes de
              l&apos;Univers.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap gap-2 mb-8">
              {subCategories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Button key={cat.name} variant="outline" size="sm" className="gap-2">
                    <IconComponent className="h-4 w-4" />
                    {cat.name}
                    <Badge variant="secondary" className="ml-1">
                      {cat.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-indigo-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {espaceArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {espaceArticles.slice(4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="horizontal" />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" size="lg">
                    Charger plus d&apos;articles
                  </Button>
                </div>
              </div>

              <aside className="space-y-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-foreground">Événements à venir</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Orbit className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Lancement Falcon 9</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Telescope className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Conjunction planétaire</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Rocket className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Passage ISS</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Tendances</h3>
                  </div>
                  <div className="space-y-4">
                    {mockTrendingArticles.map((article, index) => (
                      <a key={index} href={article.href} className="flex items-start gap-3 group">
                        <span className="font-serif text-2xl font-bold text-primary/30">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {article.date}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Thèmes</h3>
                  <div className="space-y-2">
                    {subCategories.slice(1).map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <a
                          key={cat.name}
                          href="#"
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{cat.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{cat.count}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Espace</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités spatiales directement dans votre boîte mail.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-3 py-2 text-sm bg-primary-foreground text-foreground rounded-sm placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 text-sm font-medium bg-primary-foreground text-primary rounded-sm hover:bg-primary-foreground/90 transition-colors"
                    >
                      S&apos;inscrire
                    </button>
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
