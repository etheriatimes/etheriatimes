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
  Users,
  Building2,
  Vote,
  FileText,
  Landmark,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: FileText, count: 1247 },
  { name: "Gouvernement", icon: Building2, count: 342 },
  { name: "Parlement", icon: Landmark, count: 289 },
  { name: "Élections", icon: Vote, count: 198 },
  { name: "Partis politiques", icon: Users, count: 156 },
  { name: "Opinion", icon: TrendingUp, count: 262 },
];

const mockFeaturedArticle = {
  title: "Réforme historique : le Parlement adopte la nouvelle loi sur la transition énergétique",
  excerpt: "Après des mois de débats, les diputados ont votado à une large majorité cette réforme.",
  category: "Politique",
  image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=675&fit=crop",
  date: "Il y a 2 heures",
  href: "/politique/article/reforme-energie",
};

const mockPoliticsArticles = [
  {
    title: "Municipales 2026 : les premiers résultats tombent",
    excerpt: "Les bureaux de vote ont fermé leurs portes à 20h. Découvrez les premières tendances.",
    category: "Élections",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: "/politique/article/municipales-resultats",
  },
  {
    title: "Le Premier ministre annonce un remaniement",
    excerpt: "Suite aux dernières évolutions politiques, un nouveau gouvernement est attendu.",
    category: "Gouvernement",
    image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=250&fit=crop",
    date: "Il y a 3 heures",
    href: "/politique/article/remaniement",
  },
  {
    title: "Débat à l'assemblée : le pouvoir d'achat",
    excerpt:
      "Les député·es ont débattu des mesures pour améliorer le pouvoir d'achat des Français.",
    category: "Parlement",
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/politique/article/debat-pouvoir-achat",
  },
  {
    title: "Sondage : confiance des citoyens en hausse",
    excerpt: " Selon un nouveau sondage, la confiance envers les institutions progresse.",
    category: "Opinion",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/politique/article/sondage-confiance",
  },
  {
    title: "Loi immigration : le texte adopté au Sénat",
    excerpt: "Le Sénat a adopté le projet de loi sur l'immigration en première lecture.",
    category: "Parlement",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/politique/article/immigration-senat",
  },
  {
    title: "Interview exclusive : le ministre de l'Économie",
    excerpt: "Dans un entretien, il présente ses priorités pour 2026.",
    category: "Gouvernement",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/politique/article/interview-ministre",
  },
  {
    title: "Présidentielle 2027 : les candidats se positionnent",
    excerpt: "À deux ans de l'échéance, les prétendants commencent leur campagne.",
    category: "Élections",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/politique/article/presidentielle-2027",
  },
  {
    title: "Coalition : accord trouvé entre les partis",
    excerpt: "Les négociations ont abouti à un accord de coalition pour les régionales.",
    category: "Partis politiques",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/politique/article/coalition-regionales",
  },
];

const mockTrendingArticles = [
  {
    title: "Réforme des retraites : retour en arrière",
    date: "Il y a 4 heures",
    href: "/politique/article/retraites",
  },
  {
    title: "Nouveau parti politique : meeting inaugural",
    date: "Il y a 6 heures",
    href: "/politique/article/nouveau-parti",
  },
  {
    title: "Réforme fiscale : les propositions",
    date: "Hier",
    href: "/politique/article/fiscale",
  },
  {
    title: "Union européenne : sommet à Bruxelles",
    date: "Hier",
    href: "/politique/article/sommet-ue",
  },
  {
    title: "Interview : le chef de l'opposition",
    date: "Il y a 2 jours",
    href: "/politique/article/interview-opposition",
  },
];

async function getPoliticsArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch politics articles:", error);
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
      : "Politique",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/politique/article/${article.slug}`,
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

export default async function PolitiquePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getPoliticsArticles(locale);

  const politicsArticles = mergeWithMock(
    homepageData?.sections?.politique?.map(articleToCardProps),
    mockPoliticsArticles
  );

  const featured = homepageData?.featured
    ? articleToCardProps(homepageData.featured)
    : mockFeaturedArticle;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href={`/${locale}`} className="hover:text-foreground">
              Accueil
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Politique</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Politique
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Actualités politiques, analyses, debats et opinions sur la vie politique française et
            internationale.
          </p>
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-primary" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {politicsArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {politicsArticles.slice(4).map((article, index) => (
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Politique</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités politiques directement dans votre boîte mail.
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
