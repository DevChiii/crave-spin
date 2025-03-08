<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	
	// Inject analytics tracking
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	
	let { children } = $props();
  </script>
  
  <Navbar />
  {@render children()}