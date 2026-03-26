"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const categories = [
  "Politique",
  "Économie",
  "International",
  "Culture",
  "Sport",
  "Société",
  "Technologie",
  "Santé",
  "Environnement",
];

const tags = [
  "Breaking",
  "Editorial",
  "Interview",
  "Reportage",
  "Analyse",
  "Opinion",
  "Faits divers",
  "Éducation",
  "Religion",
];

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/articles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nouvel article</h1>
            <p className="text-sm text-muted-foreground">
              Créez un nouvel article pour votre publication
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </Button>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Publier
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu principal</CardTitle>
              <CardDescription>Rédigez le titre et le résumé de votre article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Titre de l'article"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Résumé</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Un court résumé de l'article..."
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{excerpt.length}/200 caractères</p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Corps de l&apos;article</CardTitle>
              <CardDescription>Rédigez le contenu complet de votre article</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Rédigez votre article ici..."
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-100"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Image principale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-sm">Cliquez pour ajouter une image</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Ajoutez des tags pour categorize votre article</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className="h-7"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="flex flex-col gap-1">
                  <span>Article en vedette</span>
                  <span className="text-xs text-muted-foreground">Afficher en première page</span>
                </Label>
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="comments" className="flex flex-col gap-1">
                  <span>Autoriser les commentaires</span>
                  <span className="text-xs text-muted-foreground">
                    Les lecteurs peuvent commenter
                  </span>
                </Label>
                <Switch id="comments" checked={allowComments} onCheckedChange={setAllowComments} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de l&apos;article</DialogTitle>
            <DialogDescription>
              Voici comment votre article apparaîtra une fois publié
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {title ? (
              <h1 className="text-2xl font-bold">{title}</h1>
            ) : (
              <p className="text-muted-foreground italic">Sans titre</p>
            )}
            {category && <p className="text-sm text-primary font-medium">{category}</p>}
            {excerpt && <p className="text-muted-foreground italic border-l-2 pl-3">{excerpt}</p>}
            {content ? (
              <div className="space-y-3 text-sm leading-relaxed">
                {content
                  .split("\n")
                  .map((paragraph, index) =>
                    paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                  )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Aucun contenu</p>
            )}
            {selectedTags.length > 0 && (
              <div className="flex gap-2">
                {selectedTags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
