const configuredApiBase = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!configuredApiBase) {
    return normalizedPath;
  }

  return `${configuredApiBase.replace(/\/$/, "")}${normalizedPath}`;
}
