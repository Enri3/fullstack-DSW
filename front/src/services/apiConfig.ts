if (!import.meta.env.VITE_URL_BACK) {
  throw new Error("VITE_URL_BACK no está configurada");
}

export const URL_BACK =
  import.meta.env.VITE_URL_BACK.replace(/\/$/, "");
