import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter(),
    // Enable SSR (Server-Side Rendering)
    prerender: {
      entries: ['*'], // Pre-renders all static pages
    },
    csrf: {
      checkOrigin: false // Fixes CSRF issues on Vercel if needed
    }
  }
};

