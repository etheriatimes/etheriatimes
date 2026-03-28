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
  Laptop,
  Server,
  Code,
  Database,
  Shield,
  Cloud,
  Bug,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Laptop, count: 534 },
  { name: "Hardware", icon: Server, count: 156 },
  { name: "Développement", icon: Code, count: 134 },
  { name: "Cybersécurité", icon: Shield, count: 98 },
  { name: "Cloud", icon: Cloud, count: 76 },
  { name: "Base de données", icon: Database, count: 70 },
];

const mockFeaturedArticle = {
  title: "Apple M4 Ultra : une puce révolutionnaire pour les professionnels",
  excerpt:
    "La nouvelle génération de silicium Apple repousse les limites de la performance sur Mac.",
  category: "Hardware",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/informatique/article/apple-m4-ultra",
};

const mockInformatiqueArticles = [
  {
    title: "NVIDIA RTX 5090 : les premiers tests sont là",
    excerpt: "La carte graphique la plus puissante jamais créée par Nvidia.",
    category: "Hardware",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/informatique/article/rtx-5090",
  },
  {
    title: "React 20 : les nouveautés annoncées",
    excerpt: "Le framework JavaScript évolue avec des performances améliorées.",
    category: "Développement",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/informatique/article/react-20",
  },
  {
    title: "Cyberattaque massive ciblant les entreprises françaises",
    excerpt: "Des milliers de systèmes ont été compromis par un groupe de hackers.",
    category: "Cybersécurité",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/informatique/article/cyberattaque-france",
  },
  {
    title: "AWS re:Invent 2026 : les annonces majeures",
    excerpt: "Amazon présente ses dernières innovations cloud.",
    category: "Cloud",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/informatique/article/aws-reinvent",
  },
  {
    title: "PostgreSQL 18 : nouvelles fonctionnalités",
    excerpt: "La base de données open source se dote d'outils avancés.",
    category: "Base de données",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/informatique/article/postgresql-18",
  },
  {
    title: "AMD announces next-gen Ryzen processors",
    excerpt: "Les nouveaux CPU promettent un bond en performance significatif.",
    category: "Hardware",
    image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/informatique/article/amd-ryzen-9000",
  },
  {
    title: "GitHub Copilot : intégration native dans VS Code",
    excerpt: "L'IA conversationnelle révolutionne le développement.",
    category: "Développement",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/informatique/article/github-copilot",
  },
  {
    title: "Zero-day vulnerability discovered in popular software",
    excerpt: "Les utilisateurs sont invités à mettre à jour immédiatement.",
    category: "Cybersécurité",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/informatique/article/zero-day",
  },
];

const mockTrendingArticles = [
  {
    title: "Comparatifs CPU/GPU du moment",
    date: "Mis à jour",
    href: "/informatique/article/comparatifs",
  },
  {
    title: "Tutoriels développement",
    date: "En cours",
    href: "/informatique/article/tutoriels",
  },
  {
    title: "Logs de sécurité",
    date: "Il y a 3 heures",
    href: "/informatique/article/security-logs",
  },
  {
    title: "Bon plans hardware",
    date: "Hier",
    href: "/informatique/article/bon-plans",
  },
  {
    title: "Podcast Tech Weekly",
    date: "Il y a 2 jours",
    href: "/informatique/article/podcast",
  },
];

async function getInformatiqueArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch informatique articles:", error);
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
      : "Informatique",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/informatique/article/${article.slug}`,
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

export default async function InformatiquePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getInformatiqueArticles(locale);

  const informatiqueArticles = mergeWithMock(
    homepageData?.sections?.informatique?.map(articleToCardProps),
    mockInformatiqueArticles
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
              <span className="text-foreground">Informatique</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Informatique
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Hardware, développement, cybersécurité, cloud et toute l&apos;actualité tech.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-cyan-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {informatiqueArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {informatiqueArticles.slice(4).map((article, index) => (
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
                    <Bug className="h-5 w-5 text-cyan-600" />
                    <h3 className="font-semibold text-foreground">Veille Tech</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Nouveautés</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Alertes</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Cloud className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mises à jour</span>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Informatique</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités tech directement dans votre boîte mail.
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
