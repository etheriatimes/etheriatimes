import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

type Locale = (typeof routing.locales)[number];

const countryToLocale: Record<string, Locale> = {
  BE: "be_fr",
  CH: "ch_fr",
  FR: "fr",
};

function getCountryFromRequest(request: NextRequest): string | null {
  const cloudflareCountry = request.headers.get("cf-ipcountry");
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const fastlyCountry = request.headers.get("x-fastly-geo-country");

  return cloudflareCountry || vercelCountry || fastlyCountry || null;
}

function getLocaleFromCountry(country: string | null): Locale {
  if (country && country in countryToLocale) {
    return countryToLocale[country];
  }
  return routing.defaultLocale;
}

function isValidLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const urlLocale = segments[0];

  if (pathname === "/" || pathname === "") {
    const country = getCountryFromRequest(request);
    const locale = getLocaleFromCountry(country);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (urlLocale && !isValidLocale(urlLocale)) {
    const country = getCountryFromRequest(request);
    const locale = getLocaleFromCountry(country);
    const newPath = `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login|register|dashboard|user).*)",
  ],
};
