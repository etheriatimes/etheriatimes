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
  Palette,
  Film,
  Music,
  BookOpen,
  Theater,
  Camera,
  Utensils,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Palette, count: 756 },
  { name: "Cinéma", icon: Film, count: 198 },
  { name: "Musique", icon: Music, count: 167 },
  { name: "Littérature", icon: BookOpen, count: 143 },
  { name: "Arts scéniques", icon: Theater, count: 112 },
  { name: "Arts visuels", icon: Camera, count: 136 },
];

const mockFeaturedArticle = {
  title: "Festival de Cannes 2026 : la liste des sélectionnée",
  excerpt:
    "Le jury présidé par une personnalité prestigieux a révélé les 21 films en compétition officielle.",
  category: "Cinéma",
  image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/culture/article/cannes-2026",
};

const mockCultureArticles = [
  {
    title: "Exposition Monet : record d'affluence au Musée d'Orsay",
    excerpt: "Plus de 500 000 visiteurs en deux mois pour cette rétrospective exceptionnelle.",
    category: "Arts visuels",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/culture/article/monet-orsay",
  },
  {
    title: "Nouveaux talents de la chanson française",
    excerpt: "Découvrez les artistes qui marquent la scène musicale cette année.",
    category: "Musique",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/culture/article/nouveaux-talents",
  },
  {
    title: "Prix Goncourt 2026 : le lauréat est connu",
    excerpt: "Un premier roman délicat et touchant récompense un jeune auteur prometteur.",
    category: "Littérature",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/culture/article/goncourt-2026",
  },
  {
    title: "Opéra de Paris : nouvelle saison spectaculaire",
    excerpt: "Des productions ambitieuses et des incontournés au programme.",
    category: "Arts scéniques",
    image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/culture/article/opera-paris",
  },
  {
    title: "Street art : fresques monumentales à Paris",
    excerpt: "De nouveaux murs s'illuminent dans les quartiers parisiens.",
    category: "Arts visuels",
    image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/culture/article/street-art-paris",
  },
  {
    title: "Netflix announces French original series",
    excerpt: "Une série hexagonale fait sensation sur la plateforme de streaming.",
    category: "Cinéma",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/culture/article/netflix-french",
  },
  {
    title: "Festival de jazz de Montreux : édition record",
    excerpt: "Plus de 250 000 festivaliers attendus pour cette édition anniversaire.",
    category: "Musique",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/culture/article/montreux-jazz",
  },
  {
    title: "Architecture : la pyramide du Louvre fête ses 40 ans",
    excerpt: "L'œuvre de Pei demeure emblématique du renouveau muséal.",
    category: "Arts visuels",
    image: "https://images.unsplash.com/photo-1499426600726-ac57c67be1dc?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/culture/article/pyramid-louvre",
  },
];

const mockTrendingArticles = [
  {
    title: "Oscars 2026 : nominations annoncées",
    date: "Il y a 1 heure",
    href: "/culture/article/oscars-2026",
  },
  {
    title: "Victoires de la Musique : le palmarès",
    date: "Hier",
    href: "/culture/article/victoires-musique",
  },
  {
    title: "Bestsellers : les livres les plus vendus",
    date: "Il y a 3 heures",
    href: "/culture/article/bestsellers",
  },
  {
    title: "Émissions culturelles à ne pas manquer",
    date: "Hier",
    href: "/culture/article/emissions",
  },
  {
    title: "Agendas concerts et festivals",
    date: "Il y a 2 jours",
    href: "/culture/article/agenda",
  },
];

async function getCultureArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch culture articles:", error);
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
      : "Culture",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/culture/article/${article.slug}`,
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

export default async function CulturePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getCultureArticles(locale);

  const cultureArticles = mergeWithMock(
    homepageData?.sections?.culture?.map(articleToCardProps),
    mockCultureArticles
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
              <span className="text-foreground">Culture</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Culture
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Arts, spectacles, littérature, cinéma et toutes les actualités culturelles.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-purple-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cultureArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {cultureArticles.slice(4).map((article, index) => (
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
                    <Film className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-foreground">Au cinéma</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Film className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Nouveautés</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Festivals</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Adaptations</span>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Culture</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités culturelles directement dans votre boîte mail.
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
