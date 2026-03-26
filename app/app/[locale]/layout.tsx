import { Locale, isValidLocale, defaultLocale } from "@/lib/locale";
import { LocaleProvider } from "@/context/locale-context";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  return <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>;
}
