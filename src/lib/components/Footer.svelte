<script lang="ts">
  import { onMount } from 'svelte';
  
  // Modal state management
  let showTosModal = false;
  let showPrivacyModal = false;
  
  // Function to open the Terms of Service modal
  function openTosModal() {
    showTosModal = true;
    showPrivacyModal = false; // Ensure only one modal is open at a time
  }
  
  // Function to open the Privacy Policy modal
  function openPrivacyModal() {
    showPrivacyModal = true;
    showTosModal = false; // Ensure only one modal is open at a time
  }
  
  // Function to close all modals
  function closeModals() {
    showTosModal = false;
    showPrivacyModal = false;
  }
  
  // Handle clicking outside the modal to close it
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      closeModals();
    }
  }
  
  // Close modals on escape key press
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModals();
    }
  }
  
  onMount(() => {
    // Add event listener for escape key
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      // Clean up event listener
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<footer class="bg-[#333333] text-[#F5F5F5] py-12 mt-10">
  <div class="container mx-auto text-center">
    <!-- Stylized Divider -->
    <div class="relative mb-8">
      <div class="absolute inset-x-0 top-0 h-1 bg-[#FFD700] transform rotate-12 translate-y-1/2 sm:rotate-8 md:rotate-6 lg:rotate-4 xl:rotate-4"></div>
      <h2 class="relative text-3xl font-extrabold text-[#F5F5F5]">Let's Get Craving!</h2>
    </div>
    
    <!-- Footer Navigation -->
    <div class="mb-6">
      <a href="/contact" class="text-[#FFD700] text-lg font-semibold hover:text-[#FF6347] transition-all duration-300 mx-2">
        Contact
      </a>
      |
      <a href="/about" class="text-[#FFD700] text-lg font-semibold hover:text-[#FF6347] transition-all duration-300 mx-2">
        About
      </a>
      |
      <button 
        on:click={openTosModal}
        class="text-[#FFD700] text-lg font-semibold hover:text-[#FF6347] transition-all duration-300 mx-2 bg-transparent border-none cursor-pointer"
      >
        Terms of Service
      </button>
      |
      <button 
        on:click={openPrivacyModal}
        class="text-[#FFD700] text-lg font-semibold hover:text-[#FF6347] transition-all duration-300 mx-2 bg-transparent border-none cursor-pointer"
      >
        Privacy Policy
      </button>
    </div>
    
    <!-- DMCA Badge -->
    <div class="mt-6 flex justify-center">
      <a href="https://www.dmca.com/Protection/Status.aspx?ID=f70f38c5-a29a-4833-93c3-cfdfead2a113" title="DMCA.com Protection Status">
        <img src="https://images.dmca.com/Badges/dmca_protected_25_120.png?ID=f70f38c5-a29a-4833-93c3-cfdfead2a113" alt="DMCA.com Protection Status" />
      </a>
      <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>
    </div>
    
    <!-- Copyright -->
    <p class="text-sm font-light mt-4">
      &copy; 2025 CraveSpin. All Rights Reserved.
    </p>
  </div>
</footer>

<!-- Terms of Service Modal -->
{#if showTosModal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
    on:click={handleClickOutside}
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[80vh] text-[#333333]">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-[#FF6347]">Terms of Service</h2>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button 
          on:click={closeModals}
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
        <!-- Modal content here... -->
        <p>Terms of Service content...</p>
      </div>
      
      <div class="border-t border-gray-200 p-4 text-center">
        <button 
          on:click={closeModals}
          class="px-6 py-2 bg-[#FF6347] text-white rounded-full hover:bg-[#FFD700] hover:text-[#333333] transition-all duration-300"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Privacy Policy Modal -->
{#if showPrivacyModal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
    on:click={handleClickOutside}
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[80vh] text-[#333333]">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <h2 class="text-2xl font-bold text-[#FF6347]">Privacy Policy</h2>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button 
          on:click={closeModals}
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
        <!-- Modal content here... -->
        <p>Privacy Policy content...</p>
      </div>
      
      <div class="border-t border-gray-200 p-4 text-center">
        <button 
          on:click={closeModals}
          class="px-6 py-2 bg-[#FF6347] text-white rounded-full hover:bg-[#FFD700] hover:text-[#333333] transition-all duration-300"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
{/if}
