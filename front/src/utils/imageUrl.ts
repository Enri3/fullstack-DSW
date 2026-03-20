const API_BASE_URL = "http://localhost:4000";

export function buildImageUrl(urlImg?: string): string {
  if (!urlImg) return "/placeholder.png";

  if (/^https?:\/\//i.test(urlImg)) {
    return urlImg;
  }

  if (urlImg.startsWith("/")) {
    return `${API_BASE_URL}${urlImg}`;
  }

  return `${API_BASE_URL}/${urlImg}`;
}
