import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/locale";

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
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname === "") {
    const country = getCountryFromRequest(request);
    const locale = getLocaleFromCountry(country);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
