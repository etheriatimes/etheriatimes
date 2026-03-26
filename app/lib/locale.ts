export type Locale = "fr" | "be-fr" | "be-nl" | "ch-fr";

export type LocaleConfig = {
  code: Locale;
  label: string;
  country: string;
  flag: string;
};

export const locales: LocaleConfig[] = [
  { code: "fr", label: "France", country: "FR", flag: "🇫🇷" },
  { code: "be-fr", label: "Belgique (FR)", country: "BE", flag: "🇧🇪" },
  { code: "be-nl", label: "Belgique (NL)", country: "BE", flag: "🇧🇪" },
  { code: "ch-fr", label: "Suisse (FR)", country: "CH", flag: "🇨🇭" },
];

export const defaultLocale: Locale = "fr";

export function isValidLocale(locale: string): locale is Locale {
  return locales.some((l) => l.code === locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}
