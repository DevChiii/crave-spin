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
    
    <!-- Copyright -->
    <p class="text-sm font-light">
      &copy; 2025 CraveSpin. All Rights Reserved.
    </p>
  </div>
</footer>

<!-- Terms of Service Modal -->
{#if showTosModal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
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
        <div class="space-y-4 text-left">
          <h3 class="text-lg font-semibold text-[#FFD700]">1. Introduction</h3>
          <p>
            Welcome to CraveSpin! These Terms of Service govern your use of our website and services. By using CraveSpin, you agree to these terms in full. If you disagree with any part of these terms, please do not use our website or services.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">2. Service Description</h3>
          <p>
            CraveSpin is a casual, fun platform designed for entertainment purposes only. Our services are not intended for commercial use or for health-related purposes. We provide food-related content, recommendations, and interactive features for recreational use only.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">3. User Conduct</h3>
          <p>
            When using our services, you agree to:
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Provide accurate information when using our contact form</li>
            <li>Not submit spam, abusive, or offensive content</li>
            <li>Not attempt to misuse or exploit our platform</li>
            <li>Not use our services for any illegal purposes</li>
          </ul>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">4. Intellectual Property</h3>
          <p>
            All content created by CraveSpin, including original text, graphics, logos, and code developed for the app, is owned by CraveSpin or its respective creators and is protected under applicable copyright and intellectual property laws.
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Third-party software, such as SvelteKit, and AI-generated code, text, and graphics are used in accordance with their respective licenses.</li>
            <li>While CraveSpin retains ownership of its app content and design, the use of third-party software and AI-generated elements is subject to their respective terms and licenses.</li>
            <li>You may not reproduce, distribute, or create derivative works of CraveSpin's original content without our express permission.</li>
          </ul>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">5. Disclaimer of Warranties</h3>
          <p>
            CraveSpin is provided "as is" without any warranties, expressed or implied. We do not guarantee that our services will be error-free, uninterrupted, or that any defects will be corrected.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">6. Limitation of Liability</h3>
          <p>
            CraveSpin shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">7. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of CraveSpin after such changes constitutes your acceptance of the new terms.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">8. Contact Information</h3>
          <p>
            If you have any questions about these Terms of Service, please contact us through our contact form.
          </p>
          
          <p class="text-sm text-gray-500 mt-6">
            Last updated: March 9, 2025
          </p>
        </div>
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
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
    on:click={handleClickOutside}
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[80vh] text-[#333333]">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
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
        <div class="space-y-4 text-left">
          <h3 class="text-lg font-semibold text-[#FFD700]">1. Information We Collect</h3>
          <p>
            When you use our contact form, we collect the following information:
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Your email address</li>
            <li>The content of your message</li>
            <li>Timestamp of your submission</li>
          </ul>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">2. How We Use Your Information</h3>
          <p>
            We use the information you provide to:
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Respond to your inquiries and messages</li>
            <li>Improve our website and services</li>
            <li>Send you replies to your specific questions</li>
          </ul>
          <p>
            We do not use your information for marketing purposes or add your email to any newsletter lists without your explicit consent.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">3. Third-Party Services</h3>
          <p>
            We use Formspree to process our contact form submissions. By using our contact form, you acknowledge that your information will be transferred to Formspree for processing in accordance with their terms of service and privacy policy. Formspree operates in accordance with relevant privacy and intellectual property laws, including data protection regulations.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">4. Intellectual Property</h3>
          <p>
            All content created by CraveSpin, including original text, graphics, logos, and code developed for the app, is owned by CraveSpin or its respective creators and is protected under applicable copyright and intellectual property laws.
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Third-party software, such as SvelteKit, and AI-generated code, text, and graphics are used in accordance with their respective licenses.</li>
            <li>While CraveSpin retains ownership of its app content and design, the use of third-party software and AI-generated elements is subject to their respective terms and licenses.</li>
            <li>You may not reproduce, distribute, or create derivative works of CraveSpin's original content without our express permission.</li>
            <li>CraveSpin is not a registered trademark, but all original content is still protected under applicable copyright and intellectual property laws.</li>
          </ul>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">5. Data Retention</h3>
          <p>
            We retain your contact information and message content only as long as necessary to address your inquiry. We may retain anonymous, aggregated data for statistical purposes.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">6. Your Rights</h3>
          <p>
            You have the right to:
          </p>
          <ul class="list-disc ml-6 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to our processing of your information</li>
          </ul>
          <p>
            To exercise these rights, please contact us through our contact form.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">7. Security</h3>
          <p>
            We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">8. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
          
          <h3 class="text-lg font-semibold text-[#FFD700]">9. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our contact form.
          </p>
          
          <p class="text-sm text-gray-500 mt-6">
            Last updated: March 9, 2025
          </p>
        </div>
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