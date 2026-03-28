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
  Users,
  Home,
  Scale,
  Heart,
  Briefcase,
  GraduationCap,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

const isDev = process.env.NODE_ENV !== "production";

const subCategories = [
  { name: "Tous", icon: Users, count: 823 },
  { name: "Société", icon: Home, count: 234 },
  { name: "Éducation", icon: GraduationCap, count: 156 },
  { name: "Emploi", icon: Briefcase, count: 189 },
  { name: "Justice", icon: Scale, count: 112 },
  { name: "Santé", icon: Heart, count: 132 },
];

const mockFeaturedArticle = {
  title: "Réforme des retraites : le Conseil Constitutionnel se prononce",
  excerpt:
    "Les Sages doivent décider de la conformité de la dernière version du texte avec la Constitution.",
  category: "Société",
  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=675&fit=crop",
  date: "Il y a 1 heure",
  href: "/societe/article/reforme-retraites",
};

const mockSocieteArticles = [
  {
    title: "Logement : nouvelle aide pour les locataires",
    excerpt: "Le gouvernement annonce un dispositif pour faciliter l'accès au parc privé.",
    category: "Société",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
    date: "Il y a 2 heures",
    href: "/societe/article/aide-logement",
  },
  {
    title: "Université : record d'inscriptions cette année",
    excerpt: "Les établissements français attirent toujours plus d'étudiants.",
    category: "Éducation",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
    date: "Il y a 4 heures",
    href: "/societe/article/universite-inscriptions",
  },
  {
    title: "Chômage : les chiffres du mois publiés",
    excerpt: "Une baisse inattendue encourageante pour le marché de l'emploi.",
    category: "Emploi",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop",
    date: "Il y a 5 heures",
    href: "/societe/article/chomage-chiffres",
  },
  {
    title: "Procès historique : le verdict est tombé",
    excerpt: "Une décision de justice qui fait date dans la jurisprudence française.",
    category: "Justice",
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=250&fit=crop",
    date: "Il y a 6 heures",
    href: "/societe/article/proces-verdict",
  },
  {
    title: "Santé mentale : campagne nationale de prévention",
    excerpt: "Les pouvoirs publics veulent déstigmatiser les troubles psychologiques.",
    category: "Santé",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/societe/article/sante-mentale",
  },
  {
    title: "Salaire minimum : vers une nouvelle hausse",
    excerpt: "Le gouvernement envisage une revalorisation au-delà de l'inflation.",
    category: "Emploi",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/societe/article/smic-hausse",
  },
  {
    title: "Enfants : nouvelle politique familiale",
    excerpt: "Des mesures pour soutenir les familles nombreuses.",
    category: "Société",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=250&fit=crop",
    date: "Hier",
    href: "/societe/article/famille-politique",
  },
  {
    title: "Handicap : accessibilité des transports",
    excerpt: "Un plan d'investissement pour améliorer la situation.",
    category: "Société",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=250&fit=crop",
    date: "Il y a 2 jours",
    href: "/societe/article/handicap-transports",
  },
];

const mockTrendingArticles = [
  {
    title: "Débats société : les议题 du moment",
    date: "En cours",
    href: "/societe/article/debats",
  },
  {
    title: "Témoignages : ils racontent",
    date: "Mis à jour",
    href: "/societe/article/temoignages",
  },
  {
    title: "Chiffres et statistiques",
    date: "Il y a 3 heures",
    href: "/societe/article/chiffres",
  },
  {
    title: "Initiatives solidaires",
    date: "Hier",
    href: "/societe/article/solidarite",
  },
  {
    title: "Podcast Société",
    date: "Il y a 2 jours",
    href: "/societe/article/podcast",
  },
];

async function getSocieteArticles(locale: string) {
  if (isDev) {
    return null;
  }
  try {
    const response = (await articlesApi.getHomepage(locale)) as HomepageArticlesResponse;
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch societe articles:", error);
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
      : "Société",
    image:
      article.imageUrl ||
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
    date: "Il y a 1 heure",
    href: `/societe/article/${article.slug}`,
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

export default async function SocietePage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  const homepageData = await getSocieteArticles(locale);

  const societeArticles = mergeWithMock(
    homepageData?.sections?.societe?.map(articleToCardProps),
    mockSocieteArticles
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
              <span className="text-foreground">Société</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Société
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Actualités sociétales, éducation, emploi, justice, santé et vie quotidienne.
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
                  <ArticleCard {...featured} variant="featured" categoryColor="bg-teal-600" />
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Articles récents
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {societeArticles.slice(0, 4).map((article, index) => (
                      <ArticleCard key={index} {...article} variant="vertical" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Plus d&apos;articles
                  </h2>
                  <div className="space-y-4">
                    {societeArticles.slice(4).map((article, index) => (
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
                    <Heart className="h-5 w-5 text-teal-600" />
                    <h3 className="font-semibold text-foreground">En ce moment</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Consultations</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Procès en cours</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Négociations</span>
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
                  <h3 className="font-serif text-lg font-bold mb-2">Newsletter Société</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Recevez les actualités sociétales directement dans votre boîte mail.
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
