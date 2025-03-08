<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
  
	// Inject analytics tracking
	injectAnalytics({ mode: dev ? 'development' : 'production' });
  
	let { children } = $props();
  </script>
  
  {@render children()}
  