<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Inject analytics tracking
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
</script>

<svelte:head>
	<title>CraveSpin - Fun Food Roulette for Your Cravings</title>
	<meta name="description" content="CraveSpin helps you choose what to eat based on your mood and weather. Try our fun food roulette now!" />
	<meta name="keywords" content="food roulette, what to eat, food cravings, meal ideas, food spinner, CraveSpin" />
	<meta name="author" content="CraveSpin" />
	<meta name="robots" content="index, follow" />

	<!-- Social Media Preview (Open Graph & Twitter) -->
	<meta property="og:title" content="CraveSpin - Fun Food Roulette for Your Cravings" />
	<meta property="og:description" content="Struggling to decide what to eat? Let CraveSpin choose for you with a fun roulette spin!" />
	<meta property="og:url" content="https://your-vercel-url.vercel.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://your-vercel-url.vercel.app/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="CraveSpin - Food Roulette" />
	<meta name="twitter:description" content="A fun way to decide what to eat based on your mood and weather!" />
	<meta name="twitter:image" content="https://your-vercel-url.vercel.app/og-image.png" />

	<!-- DMCA Verification -->
	<meta name="dmca-site-verification" content="VlEwWmQ3WlVSSDd6OWQ3emR1R0JsZWUwVUtZZUx3Y3RhVlhRdmZmQmwvMD01" />
</svelte:head>

<Navbar />
<main class="bg-[#F5F5DC] flex-grow">
	{@render children()}
</main>
<Footer />
