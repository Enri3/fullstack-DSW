import { URL_BACK } from "../services/apiConfig";

export function buildImageUrl(urlImg?: string): string {
  if (!urlImg) return "/placeholder.png";

  if (/^https?:\/\//i.test(urlImg)) {
    return urlImg;
  }

  if (urlImg.startsWith("/")) {
    return `${URL_BACK}${urlImg}`;
  }

  return `${URL_BACK}/${urlImg}`;
}
