import { injectAnalytics } from '@vercel/analytics/sveltekit';

// @ts-ignore
export async function handle({ event, resolve }) {
  injectAnalytics(event); // This adds analytics tracking
  const response = await resolve(event);
  return response;
}
