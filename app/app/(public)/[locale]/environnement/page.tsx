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
  Leaf,
  Wind,
  Droplets,
  Sun,
  TreePine,
  Recycle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Leaf, count: 567 },
  { name: "Climat", icon: Wind, count: 145 },
  { name: "Biodiversité", icon: TreePine, count: 112 },
  { name: "Énergie", icon: Sun, count: 98 },
  { name: "Pollution", icon: Droplets, count: 87 },
  { name: "Développement durable", icon: Recycle, count: 125 },
];

const mockFeaturedArticle = {
  title: "COP31 : la France accueillera le sommet climatique",
  excerpt:
    "Le pays s'engage à organiser la prochaine conférence mondiale sur le climat à Marseille.",
  category: "Climat",
  image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/environnement/article/cop31-france",
};

const mockEnvironnementArticles = [
  {
    title: "Réchauffement climatique : nouveaux records battus",
    excerpt: "2026 sera probablement l'année la plus chaude jamais enregistrée.",
    category: "Climat",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/environnement/article/record-chaleur",
  },
  {
    title: "Océans : une aire marine protégée majeure créée",
    excerpt: "Un sanctuaire de la taille de l'Espagne voit le jour dans le Pacifique.",
    category: "Biodiversité",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/environnement/article/aire-marine",
  },
  {
    title: "Énergie solaire : record de production en France",
    excerpt: "Les panneaux photovoltaïques couvrent 20% des besoins électriques.",
    category: "Énergie",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/environnement/article/record-solaire",
  },
  {
    title: "Air quality index : les grandes villes s'améliorent",
    excerpt: "Les politiques anti-pollution portent leurs fruits dans les métropoles.",
    category: "Pollution",
    image: "https://images.unsplash.com/photo-1570641973670-ca4f0f64d3dc?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/environnement/article/qualite-air",
  },
  {
    title: "Forêts : plantation record en France",
    excerpt: "Plus de 50 millions d'arbres plantés cette année.",
    category: "Biodiversité",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/environnement/article/plantation-arbres",
  },
  {
    title: "Recyclage : le déploiement des nouvelles poubelles",
    excerpt: "La généralisation du tri sélectif s'accélère sur le territoire.",
    category: "Développement durable",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/environnement/article/recyclage-poubelles",
  },
  {
    title: "Montagne : les glaciers reculent de 3 mètres",
    excerpt: "Le changement climatique transforme durablement les sommets.",
    category: "Climat",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/environnement/article/glaciers-recul",
  },
  {
    title: "Espèces menacées : bilan annuel du WWF",
    excerpt: "La liste rouge s'allonge malgré certains succès de conservation.",
    category: "Biodiversité",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/environnement/article/wwf-bilan",
  },
];

const mockTrendingArticles = [
  {
    title: "Indices de qualité de l'air",
    date: "En direct",
    href: "/environnement/article/indices-air",
  },
  {
    title: "Éco-gestes : les bons réflexes",
    date: "Mis à jour",
    href: "/environnement/article/eco-gestes",
  },
  {
    title: "Événements nature",
    date: "Il y a 3 heures",
    href: "/environnement/article/evenements",
  },
  {
    title: "Initiatives vertes",
    date: "Hier",
    href: "/environnement/article/initiatives",
  },
  {
    title: "Podcast Écologie",
    date: "Il y a 2 jours",
    href: "/environnement/article/podcast",
  },
];

async function getEnvironnementArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch environnement articles:", error);
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
      : "Environnement",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/environnement/article/${article.slug}`,
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

export default async function EnvironnementPage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getEnvironnementArticles(locale);

  const environnementArticles = mergeWithMock(
    homepageData?.sections?.environnement?.map(articleToCardProps),
    mockEnvironnementArticles
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
              <span className="text-foreground">Environnement</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Environnement
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités écologiques, climat, biodiversité, énergie et développement durable.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-green-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {environnementArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {environnementArticles.slice(4).map((article, index) => (
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
                    <Leaf className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-foreground">État de l&apos;environnement</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Qualité de l&apos;air</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Niveau des eaux</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <TreePine className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Déforestation</span>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Environnement</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités écologiques directement dans votre boîte mail.
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
