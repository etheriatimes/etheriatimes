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
  Globe,
  Users,
  Landmark,
  Plane,
  Shield,
  Handshake,
  Map,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Map, count: 1243 },
  { name: "Europe", icon: Landmark, count: 312 },
  { name: "Amériques", icon: Users, count: 287 },
  { name: "Asie", icon: Globe, count: 256 },
  { name: "Afrique", icon: Map, count: 198 },
  { name: "Moyen-Orient", icon: Shield, count: 190 },
];

const mockFeaturedArticle = {
  title: "Sommet international sur le climat : les grandes décisions",
  excerpt:
    "Les leaders mondiaux se réunissent pour adopter de nouvelles mesures environnementales contraignantes.",
  category: "Diplomatie",
  image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/monde/article/sommet-climat",
};

const mockMondeArticles = [
  {
    title: "Élections en Allemagne : résultats définitifs",
    excerpt: "Le paysage politique allemand se redessine après des élections historiques.",
    category: "Europe",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/monde/article/allemagne-elections",
  },
  {
    title: "Tensions en mer de Chine méridionale",
    excerpt: "Des incidents maritimes ravivent les craintes d'un conflit régional.",
    category: "Asie",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/monde/article/mer-chine-tensions",
  },
  {
    title: "Accord de paix historique au Moyen-Orient",
    excerpt: "Un traité pourrait être signé après des décennies de conflit.",
    category: "Moyen-Orient",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/monde/article/peace-deal-middle-east",
  },
  {
    title: "Crise humanitaire en Afrique de l'Est",
    excerpt: "Des millions de personnes ont besoin d'une aide urgente face à la sécheresse.",
    category: "Afrique",
    image: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/monde/article/afrique-secheresse",
  },
  {
    title: "Sommet de l'OTAN : nouvelles stratégies de défense",
    excerpt: "Les alliés convinrent d'un renforcement de leur présence militaire à l'est.",
    category: "Europe",
    image: "https://images.unsplash.com/photo-1541873676-a18131494184?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/monde/article/otan-sommet",
  },
  {
    title: "Trade talks between US and EU progress",
    excerpt: "Les négociations commerciales reprennent avec l'objectif d'un nouvel accord.",
    category: "Amériques",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/monde/article/us-eu-trade",
  },
  {
    title: "Crise énergétique en Europe de l'Est",
    excerpt: "Plusieurs pays font face à des pénuries d'approvisionnement.",
    category: "Europe",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/monde/article/energie-europe",
  },
  {
    title: "Forum économique mondial à Davos",
    excerpt: "Les leaders économiques discutent des défis de la mondialisation.",
    category: "Diplomatie",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/monde/article/davos-forum",
  },
];

const mockTrendingArticles = [
  {
    title: "Guerre en Ukraine : derniers développements",
    date: "En direct",
    href: "/monde/article/ukraine-direct",
  },
  {
    title: "Élections américaines 2026 : primaires",
    date: "Il y a 3 heures",
    href: "/monde/article/usa-elections",
  },
  {
    title: "Crise du logement en Grande-Bretagne",
    date: "Hier",
    href: "/monde/article/uk-housing",
  },
  {
    title: "Expansion de l'IA : enjeux mondiaux",
    date: "Hier",
    href: "/monde/article/ai-global",
  },
  {
    title: "Réforme migratoire en Europe",
    date: "Il y a 2 jours",
    href: "/monde/article/europe-migration",
  },
];

async function getMondeArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch monde articles:", error);
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
      : "Monde",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/monde/article/${article.slug}`,
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

export default async function MondePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getMondeArticles(locale);

  const mondeArticles = mergeWithMock(
    homepageData?.sections?.monde?.map(articleToCardProps),
    mockMondeArticles
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
              <span className="text-foreground">Monde</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Monde
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités internationales, diplomatie, conflits et cooperation mondiale.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-blue-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mondeArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {mondeArticles.slice(4).map((article, index) => (
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
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-foreground">En direct</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Vol Paris-New York</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Handshake className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Négociations en cours</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Situation stable</span>
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
                  <h3 className="font-semibold text-foreground mb-4">Régions</h3>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Monde</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités internationales directement dans votre boîte mail.
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
