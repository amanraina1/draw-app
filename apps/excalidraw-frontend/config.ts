const HOST =
  typeof window !== undefined ? window.location.hostname : "localhost";
export const HTTP_BACKEND = `http://${HOST}:3001`;
export const WS_URL = `ws://${HOST}:8081`;
