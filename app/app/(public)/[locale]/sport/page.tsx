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
  Trophy,
  Medal,
  Users,
  Flag,
  Target,
  Dumbbell,
  Heart,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Trophy, count: 923 },
  { name: "Football", icon: Target, count: 312 },
  { name: "Tennis", icon: Flag, count: 156 },
  { name: "Basketball", icon: Medal, count: 134 },
  { name: "Rugby", icon: Users, count: 98 },
  { name: "Cyclisme", icon: Dumbbell, count: 87 },
];

const mockFeaturedArticle = {
  title: "Ligue 1 : le PSG champion pour la 15e fois",
  excerpt:
    "Les parisiennne décrochent un nouveau titre historique après une saison maîtrisée de bout en bout.",
  category: "Football",
  image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/sport/article/psg-champion",
};

const mockSportArticles = [
  {
    title: "Roland Garros : Nadal en finale pour la 15e fois",
    excerpt: "Le roi de la terre battue domine son adversaire en trois sets.",
    category: "Tennis",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/sport/article/nadal-finale",
  },
  {
    title: "NBA Finals : les Lakers mènent 2-1",
    excerpt: "Une série palpitante entre deux franchises emblématiques.",
    category: "Basketball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/sport/article/nba-finals",
  },
  {
    title: "Tour de France : victoire d'étape pour un Français",
    excerpt: "Une performance remarquable sur les routes alpestres.",
    category: "Cyclisme",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/sport/article/tour-france",
  },
  {
    title: "Coupe du monde de rugby : la France favorite",
    excerpt: "Les Bleus retrouvent le Mondial avec de grandes ambitions.",
    category: "Rugby",
    image: "https://images.unsplash.com/photo-1580081734807-c51e63c401fe?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/sport/article/rugby-mondial",
  },
  {
    title: "Transferts : les grandes manœuvres estivales",
    excerpt: "Les clubs européens investissent massivement sur le marché.",
    category: "Football",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/sport/article/transferts-ete",
  },
  {
    title: "Euro 2026 : les groupes dévoilés",
    excerpt: "La France héritée d'une paire à sa portée.",
    category: "Football",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/sport/article/euro-groupes",
  },
  {
    title: "F1 : pole position surprise à Monaco",
    excerpt: "Un pilote outsider part en tête de la grille sur le Rocher.",
    category: "Sport mécanique",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/sport/article/f1-monaco",
  },
  {
    title: " JO 2026 : les sites de Milano-Cortina prêts",
    excerpt: "Les dernières installations livré à quelques mois des Jeux.",
    category: "Multi-sports",
    image: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/sport/article/jo-2026",
  },
];

const mockTrendingArticles = [
  {
    title: "Mercato : les infos du jour",
    date: "En direct",
    href: "/sport/article/mercato-direct",
  },
  {
    title: "Résultats et classements",
    date: "Mis à jour",
    href: "/sport/article/resultats",
  },
  {
    title: "Interview : serial buteur de Ligue 1",
    date: "Hier",
    href: "/sport/article/interview-kylian",
  },
  {
    title: "Les Paris sportifs du week-end",
    date: "Il y a 3 heures",
    href: "/sport/article/pronos-weekend",
  },
  {
    title: "Vidéos : les plus beaux gestes",
    date: "Il y a 2 jours",
    href: "/sport/article/videos-buts",
  },
];

async function getSportArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch sport articles:", error);
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
      : "Sport",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/sport/article/${article.slug}`,
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

export default async function SportPage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getSportArticles(locale);

  const sportArticles = mergeWithMock(
    homepageData?.sections?.sport?.map(articleToCardProps),
    mockSportArticles
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
              <span className="text-foreground">Sport</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sport
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités sportives, résultats, classements et analyses des compétitions.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-orange-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sportArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {sportArticles.slice(4).map((article, index) => (
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
                    <Trophy className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-foreground">Classements</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Ligue 1</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Premier League</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Medal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Liga</span>
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
                  <h3 className="font-semibold text-foreground mb-4">Disciplines</h3>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Sport</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités sportives directement dans votre boîte mail.
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
