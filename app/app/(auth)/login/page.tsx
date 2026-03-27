"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        authApi.storeTokens(response.data.accessToken, response.data.refreshToken);
        if (response.data.user) {
          authApi.storeUser(response.data.user);
        }
        router.push("/user");
      } else {
        setError(response.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image éditoriale */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/auth-bg.jpg"
          alt="The Etheria Times"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="block">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              The Etheria Times
            </span>
          </Link>

          <div className="space-y-4">
            <div className="w-12 h-0.5 bg-primary" />
            <blockquote className="text-white">
              <p className="font-serif text-2xl font-medium leading-relaxed text-pretty">
                &ldquo;L&apos;information au service du citoyen, aujourd&apos;hui et demain.&rdquo;
              </p>
              <footer className="mt-4 text-sm text-white/60 font-sans">
                — La rédaction de The Etheria Times
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right panel — formulaire */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
        <div className="lg:hidden mb-10">
          <Link href="/">
            <span className="font-serif text-2xl font-bold text-foreground tracking-tight">
              The Etheria Times
            </span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <div className="w-8 h-0.5 bg-primary mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez à votre espace abonné et profiter de l&apos;ensemble de nos contenus.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/50 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Adresse e-mail
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="h-11 border-border bg-background focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Mot de passe
                </Label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10 border-border bg-background focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Rester connecté
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">ou</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Pas encore abonné ?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Créer un compte
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
