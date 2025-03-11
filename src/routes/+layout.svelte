<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
  
	// Inject analytics tracking
	injectAnalytics({ mode: dev ? 'development' : 'production' });
  
	let { children } = $props();
</script>
 
<svelte:head>
	<link rel="canonical" href={`https://crave-spin-u63q.vercel.app${$page.url.pathname}`} />
  
	<title>CraveSpin - Fun Spinner for Your Cravings</title>
	<meta name="description" content="CraveSpin helps you choose what to eat based on your mood and weather. Try our fun food spinner now!" />
	<meta name="keywords" content="food spinner, what to eat, food cravings, meal ideas, food spinner, CraveSpin" />
	<meta name="author" content="CraveSpin" />
	<meta name="robots" content="index, follow" />
  
	<!-- Social Media Preview (Open Graph) -->
	<meta property="og:title" content="CraveSpin - Fun Spinner for Your Cravings" />
	<meta property="og:description" content="Struggling to decide what to eat? Let CraveSpin choose for you with a fun spinner spin!" />
	<meta property="og:url" content="https://crave-spin-u63q.vercel.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://crave-spin-u63q.vercel.app/img/og-image.png" />
  
	<!-- DMCA Verification -->
	<meta name="dmca-site-verification" content="VlEwWmQ3WlVSSDd6OWQ3emR1R0JsZWUwVUtZZUx3Y3RhVlhRdmZmQmwvMD01" />
</svelte:head>

<Navbar />
<main class="bg-[#F5F5DC] flex-grow">
	{@render children()}
</main>
<Footer />
