<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // Modal state management
  let showTosModal = false;
  let showPrivacyModal = false;
  let modalElement: HTMLElement;
  let focusedElementBeforeModal: Element | null;

  // Function to open the Terms of Service modal
  function openTosModal() {
    focusedElementBeforeModal = document.activeElement;
    showTosModal = true;
    showPrivacyModal = false; // Ensure only one modal is open at a time
    document.body.classList.add('overflow-hidden'); // Prevent background scrolling
  }

  // Function to open the Privacy Policy modal
  function openPrivacyModal() {
    focusedElementBeforeModal = document.activeElement;
    showPrivacyModal = true;
    showTosModal = false; // Ensure only one modal is open at a time
    document.body.classList.add('overflow-hidden'); // Prevent background scrolling
  }

  // Function to close all modals
  function closeModals() {
    showTosModal = false;
    showPrivacyModal = false;
    document.body.classList.remove('overflow-hidden'); // Restore scrolling
    
    // Return focus to the element that was focused before the modal was opened
    if (focusedElementBeforeModal && typeof (focusedElementBeforeModal as HTMLElement).focus === 'function') {
      (focusedElementBeforeModal as HTMLElement).focus();
    }
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

  // Trap focus within the modal for accessibility
  function trapFocus(event: KeyboardEvent) {
    if (!modalElement || (!showTosModal && !showPrivacyModal)) return;
    
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  afterUpdate(() => {
    // Focus the first focusable element in the modal when opened
    if ((showTosModal || showPrivacyModal) && modalElement) {
      const firstFocusable = modalElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 50);
      }
    }
  });

  onMount(() => {
    // Add event listeners
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('keydown', handleKeydown);
      document.body.classList.remove('overflow-hidden');
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
        aria-label="Open Terms of Service"
      >
        Terms of Service
      </button>
      |
      <button 
        on:click={openPrivacyModal}
        class="text-[#FFD700] text-lg font-semibold hover:text-[#FF6347] transition-all duration-300 mx-2 bg-transparent border-none cursor-pointer"
        aria-label="Open Privacy Policy"
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
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div 
    class="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
    on:click={handleClickOutside}
    transition:fade={{ duration: 200 }}
    on:keydown={trapFocus}
    role="dialog"
    aria-modal="true"
    aria-labelledby="tos-title"
  >
    <div 
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[90vh] text-[#333333]"
      bind:this={modalElement}
      transition:fly={{ y: 20, duration: 300 }}
    >
      <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
        <h2 id="tos-title" class="text-2xl font-bold text-[#FF6347]">Terms of Service</h2>
        <button 
          on:click={closeModals}
          class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6347] rounded-full p-1 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">1. Acceptance of Terms</h3>
          <p class="mb-3">By accessing or using the CraveSpin application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">2. User Conduct</h3>
          <p class="mb-2">When using our Service, you agree to:</p>
          <ul class="list-disc ml-6 mb-3 space-y-1">
            <li>Use the Service for casual, non-commercial purposes only</li>
            <li>Not submit spam, abusive, hateful, or offensive content</li>
            <li>Not attempt to circumvent any security features of the Service</li>
            <li>Not use the Service for any illegal activities</li>
            <li>Not impersonate others or provide false information</li>
          </ul>
          <p>We reserve the right to terminate access to users who violate these terms.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">3. Content Disclaimer</h3>
          <p class="mb-3">The Service is not intended to provide health-related information, financial advice, legal counsel, or professional services. Content is provided for entertainment and informational purposes only.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">4. Communication</h3>
          <p class="mb-3">By submitting a form on our Service, you grant us permission to respond to your inquiry via the email you've provided. We may occasionally send service-related announcements but will not add you to marketing lists without explicit consent.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">5. Intellectual Property</h3>
          <p class="mb-3">All content created by CraveSpin, including original text, graphics, logos, and code, is owned by CraveSpin and protected under applicable copyright and intellectual property laws.</p>
          <p class="mb-3">Third-party software, such as SvelteKit, and AI-generated code, text, and graphics are used in accordance with their respective licenses.</p>
          <p class="mb-3">You may not reproduce, distribute, or create derivative works of CraveSpin's original content without our express permission.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">6. Limitation of Liability</h3>
          <p class="mb-3">To the maximum extent permitted by law, CraveSpin shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">7. Changes to Terms</h3>
          <p class="mb-3">We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and potentially providing additional notification.</p>
          <p class="mb-3">Your continued use of the Service after such changes constitutes your acceptance of the new terms.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">11. Governing Law</h3>
          <p class="mb-3">These Terms of Service and Privacy Policy are governed by and construed in accordance with the laws of New Zealand. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in New Zealand.</p>
        </section>        

        <section class="mb-2">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">8. Contact Information</h3>
          <p>For questions about these Terms, please contact us through our Contact form.</p>
        </section>

        <p class="text-sm text-gray-500 mt-6 italic">Last updated: March 10, 2025</p>
      </div>

      <div class="border-t border-gray-200 p-4 text-center sticky bottom-0 bg-white z-10 rounded-b-lg">
        <button 
          on:click={closeModals}
          class="px-6 py-2 bg-[#FF6347] text-white rounded-full hover:bg-[#FFD700] hover:text-[#333333] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-opacity-50"
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
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div 
    class="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
    on:click={handleClickOutside}
    transition:fade={{ duration: 200 }}
    on:keydown={trapFocus}
    role="dialog"
    aria-modal="true"
    aria-labelledby="privacy-title"
  >
    <div 
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[90vh] text-[#333333]"
      bind:this={modalElement}
      transition:fly={{ y: 20, duration: 300 }}
    >
      <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
        <h2 id="privacy-title" class="text-2xl font-bold text-[#FF6347]">Privacy Policy</h2>
        <button 
          on:click={closeModals}
          class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6347] rounded-full p-1 transition-all duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">1. Information We Collect</h3>
          <p class="mb-2">We collect the following personal information when you interact with our Service:</p>
          <ul class="list-disc ml-6 mb-3 space-y-1">
            <li>Contact information (email address)</li>
            <li>Message content you provide</li>
            <li>Device and browser information (IP address, browser type, device type)</li>
            <li>Usage data (pages visited, interaction patterns)</li>
          </ul>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">2. How We Use Your Information</h3>
          <p class="mb-2">We use your information for the following purposes:</p>
          <ul class="list-disc ml-6 mb-3 space-y-1">
            <li>To respond to your inquiries and messages</li>
            <li>To provide and maintain our Service</li>
            <li>To improve our user experience</li>
            <li>To detect and prevent technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p class="mb-3">Your email will only be used to respond to your message and will not be added to marketing lists without your explicit consent.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">3. Third-Party Services</h3>
          <p class="mb-3">We use Formspree to process form submissions. By using our contact form, you acknowledge that your information will be transferred to Formspree for processing in accordance with their <a href="https://formspree.io/legal/terms-of-service/" class="text-[#FF6347] hover:underline" target="_blank" rel="noopener noreferrer">terms of service</a> and <a href="https://formspree.io/legal/privacy-policy/" class="text-[#FF6347] hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>.</p>
          
          <p class="mb-3">We use anonymous analytics tools to improve our Service. These tools collect information sent by your browser, including device information and interactions with our Service.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">4. Cookies and Tracking</h3>
          <p class="mb-3">Our Service uses essential cookies that are necessary for its proper functioning. We also use third-party analytics cookies (such as Google Analytics) to understand how visitors interact with our website. These cookies collect information anonymously, including but not limited to your IP address, browser type, device type, and pages visited.</p>
          
          <p class="mb-3">By using our Service, you consent to the use of cookies for these purposes. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our Service may not function properly, and you may not be able to use all of its features.</p>
        </section>        

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">5. Data Retention</h3>
          <p class="mb-3">We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including responding to your inquiries and complying with legal obligations.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">6. Data Security</h3>
          <p class="mb-3">We take reasonable precautions to protect your personal information from unauthorized access, use, or disclosure. This includes encryption, secure servers, and other industry-standard security measures. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.</p>
          
          <p class="mb-3">While we strive to protect your personal information, please be aware that any data you submit online can be vulnerable to unauthorized access or disclosure. By using our Service, you acknowledge and accept these inherent risks.</p>
        </section>        

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">7. Your Rights</h3>
          <p class="mb-2">Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul class="list-disc ml-6 mb-3 space-y-1">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your personal data</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
          <p class="mb-3">To exercise these rights, please contact us through our Contact form.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">8. Children's Privacy</h3>
          <p class="mb-3">Our Service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If we discover that a child under 16 has provided us with personal information, we will promptly delete it.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">9. Changes to This Privacy Policy</h3>
          <p class="mb-3">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
        </section>

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">9. Governing Law</h3>
          <p class="mb-3">Any disputes regarding your personal information and this Privacy Policy will be governed by the laws of New Zealand, as outlined in our <a href="/terms-of-service" class="text-[#FF6347] hover:underline">Terms of Service</a>.</p>
        </section>

        <section class="mb-2">
          <h3 class="text-xl font-semibold mb-3 text-[#333333]">11. Contact Us</h3>
          <p>For any questions about this Privacy Policy, please contact us through our Contact form.</p>
        </section>

        <p class="text-sm text-gray-500 mt-6 italic">Last updated: March 10, 2025</p>
      </div>

      <div class="border-t border-gray-200 p-4 text-center sticky bottom-0 bg-white z-10 rounded-b-lg">
        <button 
          on:click={closeModals}
          class="px-6 py-2 bg-[#FF6347] text-white rounded-full hover:bg-[#FFD700] hover:text-[#333333] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-opacity-50"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom scrollbar styling */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #FF6347;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #e65a41;
  }
</style>