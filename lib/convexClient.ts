import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CONVEX_URL_PROD
    : process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error('CONVEX_URL is not set');
}

export const convexClient = new ConvexHttpClient(CONVEX_URL);
