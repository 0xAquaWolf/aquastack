const DEFAULT_LOCAL_SITE_URL = "http://localhost:3000";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const hasPath = (url: string) => {
  try {
    return new URL(url).pathname !== "/";
  } catch {
    return false;
  }
};

export const resolveSiteUrl = () => {
  const candidate =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.CONVEX_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONVEX_SITE_URL?.trim() ||
    process.env.EXPO_PUBLIC_CONVEX_SITE_URL?.trim();

  if (!candidate) {
    return DEFAULT_LOCAL_SITE_URL;
  }

  return trimTrailingSlash(candidate);
};

export const resolveBetterAuthBaseUrl = (path = "/api/auth") => {
  const direct =
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim() ||
    process.env.EXPO_PUBLIC_BETTER_AUTH_URL?.trim();

  const base = trimTrailingSlash(direct || resolveSiteUrl());
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (hasPath(base)) {
    return base;
  }

  return `${base}${path}`;
};

export const resolveExpoScheme = () => {
  const scheme =
    process.env.EXPO_APP_SCHEME?.trim() ||
    process.env.EXPO_PUBLIC_APP_SCHEME?.trim();

  if (scheme) {
    return scheme;
  }

  if (process.env.NODE_ENV === "development") {
    return "exp";
  }

  return undefined;
};

export const resolveExpoOrigin = () => {
  const scheme = resolveExpoScheme();
  if (!scheme) {
    return undefined;
  }

  return scheme.endsWith("://") ? scheme : `${scheme}://`;
};

export const resolveTrustedOrigins = (extras: string[] = []) => {
  const expoOrigin = resolveExpoOrigin();
  return expoOrigin ? [...extras, expoOrigin] : extras;
};
