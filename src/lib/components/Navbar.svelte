<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    // Navbar items
    const navItems = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Roulette', path: '/roulette' },
      { name: 'Contact', path: '/contact' }
    ];
    
    let isMenuOpen = false;
    let scrolled = false;
    
    // Toggle mobile menu
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
    
    // Close mobile menu when clicking outside
    function closeMenu() {
      isMenuOpen = false;
    }
    
    // Track scroll for navbar background change
    onMount(() => {
      const handleScroll = () => {
        scrolled = window.scrollY > 10;
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  </script>
  
  <nav class={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#F5F5DC] shadow-md py-2' : 'bg-transparent py-4'}`}>
    <div class="container mx-auto px-6 flex justify-between items-center">
      <!-- Logo -->
      <a href="/" class="text-[#FF6347] text-2xl font-bold flex items-center">
        <span>FoodMood</span>
      </a>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        {#each navItems as item}
          <a 
            href={item.path} 
            class={`relative text-lg transition-colors duration-300 ${$page.url.pathname === item.path ? 'text-[#FF6347] font-medium' : 'text-[#333] hover:text-[#FFA500]'}`}
          >
            {item.name}
            {#if $page.url.pathname === item.path}
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6347] rounded-full"></span>
            {/if}
          </a>
        {/each}
      </div>
      
      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden text-[#FF6347] focus:outline-none" 
        on:click={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {#if isMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        on:click={closeMenu}
      ></div>
      
      <div class="fixed top-0 right-0 w-64 h-full bg-[#F5F5DC] z-50 transform transition-transform duration-300 ease-in-out">
        <div class="flex justify-end p-4">
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button class="text-[#FF6347]" on:click={closeMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="flex flex-col space-y-4 p-4">
          {#each navItems as item}
            <a 
              href={item.path} 
              class={`py-2 px-4 rounded-md transition-colors duration-300 ${$page.url.pathname === item.path ? 'bg-[#FF6347] text-[#F5F5DC] font-medium' : 'text-[#333] hover:bg-[#FFA500] hover:text-[#F5F5DC]'}`}
              on:click={closeMenu}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>
  
  <!-- Spacer to prevent content from hiding under the navbar -->
  <div class="h-16"></div>