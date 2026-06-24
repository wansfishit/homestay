import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE_PATTERN = /\.(.*)$/;
const SUPPORTED_LOCALES = ['id', 'en'];
const DEFAULT_LOCALE = 'id';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip if API, static assets, internal files, or admin paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo.png') ||
    pathname.startsWith('/admin') || // Handled separately in Dashboard auth client-side/server-side logic
    PUBLIC_FILE_PATTERN.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Check if the URL already has a supported locale prefix
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. Negotiate locale (Default to id, or read Accept-Language header)
  let locale = DEFAULT_LOCALE;
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (SUPPORTED_LOCALES.includes(preferred)) {
      locale = preferred;
    }
  }

  // 4. Redirect to the localized path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!_next|api|favicon.ico|logo.png|admin).*)',
  ],
};
