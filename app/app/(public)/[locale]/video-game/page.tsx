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
  Gamepad2,
  Monitor,
  Smartphone,
  Tv2,
  Cpu,
  Joystick,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Gamepad2, count: 678 },
  { name: "PC", icon: Monitor, count: 189 },
  { name: "Console", icon: Tv2, count: 167 },
  { name: "Mobile", icon: Smartphone, count: 134 },
  { name: "Esport", icon: Cpu, count: 98 },
  { name: "Retro", icon: Joystick, count: 90 },
];

const mockFeaturedArticle = {
  title: "GTA VI : Rockstar révèle la date de sortie",
  excerpt:
    "Le jeu le plus attendu de la décennie sera disponible à la fin de l'année sur PS5 et Xbox Series.",
  category: "Console",
  image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/video-game/article/gta-vi-date",
};

const mockVideoGameArticles = [
  {
    title: "Elden Ring Nightreign : date de sortie confirmée",
    excerpt: "Le spin-off coop de FromSoftware débarque cet été.",
    category: "PC",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/video-game/article/elden-ring-nightreign",
  },
  {
    title: "Nintendo Switch 2 : enfin officialisée",
    excerpt: "La nouvelle console hybride sera rétrocompatible et plus puissante.",
    category: "Console",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/video-game/article/switch-2",
  },
  {
    title: "Esport : Team Vitality championne d'Europe",
    excerpt: "L'équipe française s'impose lors d'une finale spectaculaire.",
    category: "Esport",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/video-game/article/vitality-champion",
  },
  {
    title: "PlayStation Plus : les jeux du mois",
    excerpt: "Une sélection éclectique attendue par les abonnés.",
    category: "Console",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/video-game/article/ps-plus-mars",
  },
  {
    title: "Pokémon Legends Z-A : nouvelles informations",
    excerpt: "Game Freak tease des mécanismes de jeu innovants.",
    category: "Console",
    image: "https://images.unsplash.com/photo-1616587226157-48e49175ee20?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/video-game/article/pokemon-legends-za",
  },
  {
    title: "Steam Deck OLED : Valve prépare une mise à jour",
    excerpt: "La console portable pourrait recevoir un écran plus grand.",
    category: "PC",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/video-game/article/steam-deck-oled",
  },
  {
    title: "The Witcher 4 : première bande-annonce",
    excerpt: "CD Projekt Red lève le voile sur sa nouvelle aventure.",
    category: "PC",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/video-game/article/witcher-4-trailer",
  },
  {
    title: "Retro gaming : le marché du collectionneur",
    excerpt: "Les jeux anciens continuent de prendre de la valeur.",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/video-game/article/retro-collection",
  },
];

const mockTrendingArticles = [
  {
    title: "Meilleurs jeux de l'année",
    date: "En cours",
    href: "/video-game/article/meilleurs-jeux-2026",
  },
  {
    title: "Guides et soluces",
    date: "Mis à jour",
    href: "/video-game/article/guides",
  },
  {
    title: "Sorties du mois",
    date: "Il y a 3 heures",
    href: "/video-game/article/sorties-mois",
  },
  {
    title: "Tests et avis",
    date: "Hier",
    href: "/video-game/article/tests",
  },
  {
    title: "Comparatifs hardware",
    date: "Il y a 2 jours",
    href: "/video-game/article/comparatifs",
  },
];

async function getVideoGameArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch video game articles:", error);
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
      : "Jeu Vidéo",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/video-game/article/${article.slug}`,
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

export default async function VideoGamePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getVideoGameArticles(locale);

  const videoGameArticles = mergeWithMock(
    homepageData?.sections?.videoGame?.map(articleToCardProps),
    mockVideoGameArticles
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
              <span className="text-foreground">Jeu Vidéo</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Jeu Vidéo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités gaming, tests, guides, esport et toute l&apos;actu des jeux vidéo.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-pink-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoGameArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {videoGameArticles.slice(4).map((article, index) => (
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
                    <Sparkles className="h-5 w-5 text-pink-600" />
                    <h3 className="font-semibold text-foreground">En ce moment</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">En promotion</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tournois live</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Tv2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Streams populaires</span>
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
                  <h3 className="font-semibold text-foreground mb-4">Plateformes</h3>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Jeu Vidéo</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actus gaming directement dans votre boîte mail.
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
