"use client"

import { 
  FileText, 
  Eye, 
  Users, 
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Données pour les graphiques
const viewsData = [
  { date: "Lun", views: 12400, visitors: 8200 },
  { date: "Mar", views: 14200, visitors: 9100 },
  { date: "Mer", views: 18900, visitors: 12300 },
  { date: "Jeu", views: 16100, visitors: 10800 },
  { date: "Ven", views: 21500, visitors: 14200 },
  { date: "Sam", views: 19300, visitors: 12900 },
  { date: "Dim", views: 15600, visitors: 10100 },
]

const categoryData = [
  { category: "Politique", articles: 45, color: "var(--chart-1)" },
  { category: "Économie", articles: 38, color: "var(--chart-2)" },
  { category: "International", articles: 32, color: "var(--chart-3)" },
  { category: "Culture", articles: 28, color: "var(--chart-4)" },
  { category: "Sport", articles: 24, color: "var(--chart-5)" },
]

const recentArticles = [
  {
    id: 1,
    title: "Les nouvelles mesures économiques annoncées par le gouvernement",
    category: "Économie",
    author: "Marie Dupont",
    authorAvatar: "",
    status: "published",
    views: 3420,
    date: "Il y a 2h",
  },
  {
    id: 2,
    title: "Sommet international sur le climat : les enjeux majeurs",
    category: "International",
    author: "Jean Martin",
    authorAvatar: "",
    status: "published",
    views: 2890,
    date: "Il y a 4h",
  },
  {
    id: 3,
    title: "Réforme de l'éducation : ce qui va changer",
    category: "Politique",
    author: "Sophie Bernard",
    authorAvatar: "",
    status: "draft",
    views: 0,
    date: "Il y a 5h",
  },
  {
    id: 4,
    title: "Le nouveau festival de musique fait sensation",
    category: "Culture",
    author: "Lucas Petit",
    authorAvatar: "",
    status: "review",
    views: 0,
    date: "Il y a 6h",
  },
  {
    id: 5,
    title: "Victoire historique de l'équipe nationale",
    category: "Sport",
    author: "Emma Leroy",
    authorAvatar: "",
    status: "published",
    views: 5670,
    date: "Il y a 8h",
  },
]

const topAuthors = [
  { name: "Marie Dupont", articles: 24, views: 45200, avatar: "" },
  { name: "Jean Martin", articles: 19, views: 38100, avatar: "" },
  { name: "Sophie Bernard", articles: 17, views: 32800, avatar: "" },
  { name: "Lucas Petit", articles: 15, views: 28400, avatar: "" },
]

const viewsChartConfig = {
  views: {
    label: "Vues",
    color: "oklch(0.5 0.2 25)",
  },
  visitors: {
    label: "Visiteurs",
    color: "oklch(0.7 0.15 250)",
  },
}

const categoryChartConfig = {
  articles: {
    label: "Articles",
    color: "oklch(0.5 0.2 25)",
  },
}

function getStatusBadge(status: string) {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Publié</Badge>
    case "draft":
      return <Badge variant="secondary">Brouillon</Badge>
    case "review":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">En révision</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur la console d&apos;administration de The Etheria Times
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Articles publiés"
          value="1,247"
          change="+12%"
          changeType="positive"
          description="vs mois dernier"
          icon={FileText}
        />
        <StatsCard
          title="Vues totales"
          value="2.4M"
          change="+18%"
          changeType="positive"
          description="vs mois dernier"
          icon={Eye}
        />
        <StatsCard
          title="Abonnés"
          value="48,293"
          change="+5.2%"
          changeType="positive"
          description="vs mois dernier"
          icon={Users}
        />
        <StatsCard
          title="Commentaires"
          value="12,847"
          change="-3%"
          changeType="negative"
          description="vs mois dernier"
          icon={MessageSquare}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Views Chart */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Trafic du site</CardTitle>
                <CardDescription>Vues et visiteurs cette semaine</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Vues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.15_250)]" />
                  <span className="text-muted-foreground">Visiteurs</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={viewsChartConfig} className="h-60 w-full">
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  fill="url(#fillVisitors)"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  fill="url(#fillViews)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Articles par catégorie</CardTitle>
            <CardDescription>Répartition ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-60 w-full">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis 
                  type="number" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="articles" 
                  fill="var(--color-articles)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles & Top Authors */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Articles */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Articles récents</CardTitle>
                <CardDescription>Les derniers articles créés ou modifiés</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/articles" className="gap-1">
                  Voir tout
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                        {article.category}
                      </Badge>
                      {getStatusBadge(article.status)}
                    </div>
                    <h4 className="font-medium text-sm truncate">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={article.authorAvatar} />
                          <AvatarFallback className="text-[8px] bg-muted">
                            {getInitials(article.author)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{article.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.date}
                      </span>
                      {article.views > 0 && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Voir</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Authors */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Top rédacteurs</CardTitle>
                <CardDescription>Ce mois-ci</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topAuthors.map((author, index) => (
                <div key={author.name} className="flex items-center gap-3 px-6 py-3">
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {author.articles} articles • {(author.views / 1000).toFixed(1)}k vues
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
