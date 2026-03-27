"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi } from "@/lib/api/client";

const passwordRequirements = [
  { label: "Au moins 8 caractères", test: (p: string) => p.length >= 8 },
  { label: "Une lettre majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const passwordValid = passwordRequirements.every((r) => r.test(form.password));
  const confirmValid = form.password === form.confirm && form.confirm.length > 0;
  const canSubmit = passwordValid && confirmValid && acceptTerms;

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      if (response.success) {
        router.push("/login?registered=true");
      } else {
        setError(response.error || "Une erreur est survenue lors de l'inscription");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image éditoriale */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <Image
          src="/images/auth-bg.jpg"
          alt="The Etheria Times"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              The Etheria Times
            </span>
          </Link>

          {/* Citation */}
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
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 bg-background overflow-y-auto">
        {/* Logo mobile */}
        <div className="lg:hidden mb-8">
          <Link href="/">
            <span className="font-serif text-2xl font-bold text-foreground tracking-tight">
              The Etheria Times
            </span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* En-tête */}
          <div className="mb-8">
            <div className="w-8 h-0.5 bg-primary mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Rejoignez des milliers de lecteurs et accédez à l&apos;information sans frontières.
            </p>
          </div>

          {/* Citation mobile */}
          <div className="lg:hidden mb-6 space-y-4">
            <div className="w-12 h-0.5 bg-primary" />
            <blockquote className="text-foreground">
              <p className="font-serif text-xl font-medium leading-relaxed text-pretty">
                &ldquo;L&apos;information au service du citoyen, aujourd&apos;hui et demain.&rdquo;
              </p>
              <footer className="mt-3 text-sm text-muted-foreground font-sans">
                — La rédaction de The Etheria Times
              </footer>
            </blockquote>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom / Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Jean"
                  className="h-11 border-border bg-background focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Dupont"
                  className="h-11 border-border bg-background focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Email */}
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
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="votre@email.com"
                className="h-11 border-border bg-background focus-visible:ring-primary"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10 border-border bg-background focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Indicateurs */}
              {form.password.length > 0 && (
                <ul className="space-y-1 pt-1">
                  {passwordRequirements.map((req) => {
                    const ok = req.test(form.password);
                    return (
                      <li
                        key={req.label}
                        className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <Check className={`h-3 w-3 ${ok ? "opacity-100" : "opacity-30"}`} />
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Confirmation */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirm"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  placeholder="••••••••"
                  className={`h-11 pr-10 border-border bg-background focus-visible:ring-primary ${
                    form.confirm.length > 0 && !confirmValid ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Masquer" : "Afficher"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.confirm.length > 0 && !confirmValid && (
                <p className="text-xs text-destructive">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            {/* Cases à cocher */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(v) => setAcceptTerms(v === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  J&apos;accepte les{" "}
                  <Link href="/conditions" className="text-primary hover:underline font-medium">
                    conditions générales
                  </Link>{" "}
                  et la{" "}
                  <Link
                    href="/confidentialite"
                    className="text-primary hover:underline font-medium"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="newsletter"
                  checked={acceptNewsletter}
                  onCheckedChange={(v) => setAcceptNewsletter(v === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="newsletter"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  Recevoir les newsletters et offres de The Etheria Times.
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !canSubmit}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm tracking-wide mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Lien connexion */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà abonné ?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Se connecter
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
