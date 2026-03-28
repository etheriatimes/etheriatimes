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
  TrendingUp,
  DollarSign,
  PieChart,
  Briefcase,
  Globe,
  FileText,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: FileText, count: 892 },
  { name: "Marchés", icon: TrendingUp, count: 234 },
  { name: "Entreprises", icon: Briefcase, count: 189 },
  { name: "Finance", icon: DollarSign, count: 156 },
  { name: "Économie réelle", icon: PieChart, count: 145 },
  { name: "International", icon: Globe, count: 168 },
];

const mockFeaturedArticle = {
  title: "La Bourse de Paris dépasse les 8 000 points pour la première fois",
  excerpt:
    "Les marchés actions européens enregistrent des gains significatifs suite aux décisions de la BCE.",
  category: "Marchés",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/economie/article/bourse-8000",
};

const mockEconomieArticles = [
  {
    title: "Inflation : le taux chute à 2.1% en mars",
    excerpt:
      "Bonne nouvelle pour les ménages français qui voient leur pouvoir d'achat s'améliorer.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/economie/article/inflation-2-1",
  },
  {
    title: " unemployment rate drops to 6.8%",
    excerpt: "Le marché de l'emploi continue de s'améliorer avec la création de 45 000 emplois.",
    category: "Économie réelle",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/economie/article/emploi-chomage",
  },
  {
    title: "Tech giant announces 2,000 new hires in France",
    excerpt:
      "Un investissement majeur qui confirme l'attractivité de la France pour les entreprises tech.",
    category: "Entreprises",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/economie/article/tech-emploi",
  },
  {
    title: "European Central Bank maintains interest rates",
    excerpt: "La BCE confirme sa politique monétaire accommodante pour soutenir la croissance.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/economie/article/bce-taux",
  },
  {
    title: "Growth forecast revised upward for 2026",
    excerpt: "Le gouvernement revise ses prévisions de croissance à 2.2% pour l'année.",
    category: "Économie réelle",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/economie/article/croissance-2026",
  },
  {
    title: "Trade negotiations resume with China",
    excerpt: "Les discussions commerciales reprennent pour un accord bilatéral ambitieux.",
    category: "International",
    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/economie/article/chine-negociations",
  },
  {
    title: "Bank results exceed expectations",
    excerpt: "Les grandes banques françaises publient des résultats trimestriels solides.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/economie/article/banques-resultats",
  },
  {
    title: "SME support plan announced by minister",
    excerpt: "Un nouveau dispositif pour aider les petites et moyennes entreprises.",
    category: "Entreprises",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/economie/article/pme-soutien",
  },
];

const mockTrendingArticles = [
  {
    title: "CAC 40 hits new record high",
    date: "Il y a 1 heure",
    href: "/economie/article/cac40-record",
  },
  {
    title: "Housing market shows signs of recovery",
    date: "Il y a 3 heures",
    href: "/economie/article/immobilier-reprise",
  },
  {
    title: "Consumer spending rises in Q1",
    date: "Hier",
    href: "/economie/article/consommation-q1",
  },
  {
    title: "Euro strengthens against dollar",
    date: "Hier",
    href: "/economie/article/euro-dollar",
  },
  {
    title: "Retail sales exceed forecasts",
    date: "Il y a 2 jours",
    href: "/economie/article/ventes-detail",
  },
];

async function getEconomieArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch economie articles:", error);
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
      : "Économie",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/economie/article/${article.slug}`,
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

export default async function EconomiePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getEconomieArticles(locale);

  const economieArticles = mergeWithMock(
    homepageData?.sections?.economie?.map(articleToCardProps),
    mockEconomieArticles
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
              <span className="text-foreground">Économie</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Économie
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités économiques, analyses des marchés financiers, politique monétaire et
              conjoncture internationale.
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
                    {economieArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {economieArticles.slice(4).map((article, index) => (
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
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-foreground">Marchés</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">CAC 40</span>
                      <span className="text-sm font-medium text-green-600">+1.24%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Euro/Dollar</span>
                      <span className="text-sm font-medium text-green-600">+0.45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Pétrole (Brent)</span>
                      <span className="text-sm font-medium text-red-600">-0.32%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
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
                  <h3 className="font-semibold text-foreground mb-4">Catégories</h3>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Économie</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités économiques directement dans votre boîte mail.
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
