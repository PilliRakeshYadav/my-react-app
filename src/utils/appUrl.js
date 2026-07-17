const basePath = import.meta.env.BASE_URL || "/";

export function appHashUrl(hashPath = "/") {
  const normalizedHashPath = hashPath.startsWith("/") ? hashPath : `/${hashPath}`;
  return `${window.location.origin}${basePath}#${normalizedHashPath}`;
}
