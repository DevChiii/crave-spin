<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte'; // Import the Footer component
  
	// Inject analytics tracking
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	
	let { children } = $props();
  </script>
  
  <Navbar />
  <main class="bg-[#F5F5DC] flex-grow"> <!-- Set Light Beige background for the whole page -->
	{@render children()}
  </main>
  <Footer /> <!-- Footer component will now blend with the page -->
  