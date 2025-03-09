<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let email: string = '';
    let message: string = '';
    let errorMessage: string = '';
    let isSubmitting: boolean = false;
    let isSuccess: boolean = false;
    let csrfToken: string = '';
    let honeypot: string = ''; // Honeypot field to catch bots
    let submitAttempts: number = 0;
    let lastSubmitTime: number = 0;
    let formspreeConfirmationCode: string = ''; // To store confirmation code
    let tosAgreed: boolean = false; // Track if user has agreed to ToS
    let showTosModal: boolean = false; // Control modal visibility
    
    // This would come from your environment variables in SvelteKit
    // Added fallback URL in case the environment variable isn't set
    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL;

    onMount(() => {
        if (browser) {
            // Generate or fetch CSRF token
            csrfToken = generateCSRFToken();
            
            // Check if local storage is available to track submission attempts
            try {
                const storedAttempts = localStorage.getItem('submitAttempts');
                if (storedAttempts) {
                    submitAttempts = parseInt(storedAttempts, 10);
                }
                
                const storedTime = localStorage.getItem('lastSubmitTime');
                if (storedTime) {
                    lastSubmitTime = parseInt(storedTime, 10);
                }
            } catch (e) {
                console.error('Local storage not available:', e);
            }
            
            // Check URL for Formspree confirmation
            const urlParams = new URLSearchParams(window.location.search);
            formspreeConfirmationCode = urlParams.get('formspree_form_submission') || '';
            if (formspreeConfirmationCode) {
                isSuccess = true;
                // Clear the URL parameter without refreshing the page
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    });
    
    function generateCSRFToken(): string {
        // In production, this would be handled by your server
        return 'csrf-' + Math.random().toString(36).substring(2) + Date.now();
    }
    
    function validateEmail(email: string): boolean {
        // More comprehensive email validation
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(email);
    }
    
    function sanitizeInput(input: string): string {
        // More thorough sanitization
        if (!input) return '';
        
        // Fixed TypeScript error by ensuring we always return a string
        return String(input)
            .replace(/[&<>"'`=\/]/g, (match: string): string => {
                const replacements: Record<string, string> = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                };
                return replacements[match] || match;
            })
            .trim();
    }
    
    function isSpam(text: string): boolean {
        // Basic spam detection - check for spam indicators
        const spamPatterns = [
            /buy now/i, 
            /\[url=/i, 
            /viagra/i, 
            /casino/i,
            /http:\/\/(?!trusted-domains\.com)/i, // Allow only specific domains
            /https:\/\/(?!trusted-domains\.com)/i
        ];
        
        return spamPatterns.some(pattern => pattern.test(text));
    }
    
    function verifyFormspreeUrl(): boolean {
        if (!formspreeUrl) return false;
        
        // Check if it's a valid Formspree URL
        const formspreePattern = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
        return formspreePattern.test(formspreeUrl);
    }
    
    function validateForm(): boolean {
        // Clear previous errors
        errorMessage = '';
        
        // Validate form
        if (!email || !message) {
            errorMessage = 'Both fields are required.';
            return false;
        }
        
        if (!validateEmail(email)) {
            errorMessage = 'Please enter a valid email address.';
            return false;
        }
        
        // Check message length
        if (message.length < 5) {
            errorMessage = 'Message is too short. Please provide more details.';
            return false;
        }
        
        if (message.length > 1000) {
            errorMessage = 'Message is too long. Please limit to 1000 characters.';
            return false;
        }
        
        // Check for spam content
        if (isSpam(message) || isSpam(email)) {
            errorMessage = 'Your message has been flagged as potential spam. Please revise.';
            return false;
        }
        
        // Verify Formspree URL is correctly formatted
        if (!verifyFormspreeUrl()) {
            errorMessage = 'Form submission service not properly configured. Please check your Formspree URL.';
            console.error('Invalid Formspree URL:', formspreeUrl);
            return false;
        }
        
        return true;
    }
    
    function openTosModal(): void {
        // First validate the form
        if (validateForm()) {
            showTosModal = true;
        }
    }
    
    function closeTosModal(): void {
        showTosModal = false;
    }
    
    function agreeTos(): void {
        tosAgreed = true;
        closeTosModal();
        // Automatically submit the form after agreeing
        submitForm();
    }
    
    async function handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        
        // If form is valid but Terms not agreed, show modal
        if (validateForm() && !tosAgreed) {
            openTosModal();
            return;
        }
        
        // If terms are agreed, submit form
        if (tosAgreed) {
            submitForm();
        }
    }
    
    async function submitForm(): Promise<void> {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime;
        
        if (timeSinceLastSubmit < 10000) { // 10 seconds
            errorMessage = 'Please wait a few seconds before submitting again.';
            return;
        }
        
        if (submitAttempts > 5 && timeSinceLastSubmit < 300000) { // 5 minutes after 5 attempts
            errorMessage = 'Too many submission attempts. Please try again later.';
            return;
        }
        
        // Check honeypot - if filled, likely a bot
        if (honeypot) {
            console.log('Bot detected via honeypot');
            isSuccess = true; // Fake success
            return;
        }
        
        // Show submitting state
        isSubmitting = true;
        
        try {
            // Sanitize inputs before submission
            const sanitizedEmail = sanitizeInput(email);
            const sanitizedMessage = sanitizeInput(message);
            
            // Track submission attempts
            submitAttempts++;
            lastSubmitTime = now;
            
            if (browser) {
                try {
                    localStorage.setItem('submitAttempts', submitAttempts.toString());
                    localStorage.setItem('lastSubmitTime', lastSubmitTime.toString());
                } catch (e) {
                    console.error('Could not save to local storage:', e);
                }
            }

            // Create FormData for Formspree (their preferred submission method)
            const formData = new FormData();
            formData.append('email', sanitizedEmail);
            formData.append('message', sanitizedMessage);
            formData.append('_csrf', csrfToken);
            formData.append('tosAgreed', 'yes'); // Add confirmation that ToS was agreed to
            
            // In production, use fetch to submit the form
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Helps prevent CSRF
                },
                body: formData,
                mode: 'cors' // Add CORS mode for cross-origin requests
            });
            
            // Log complete response for debugging
            console.log('Formspree response status:', response.status);
            const responseData = await response.json().catch(() => ({}));
            console.log('Formspree response:', responseData);
            
            if (!response.ok) {
                throw new Error(responseData.error || responseData.message || `Form submission failed: ${response.status} ${response.statusText}`);
            }
            
            // Verify response contains the expected success indicators from Formspree
            if (responseData.ok === true || responseData.success === true || responseData.next) {
                console.log('Form submitted successfully:', responseData);
                isSuccess = true;
                
                // Reset attempts after successful submission
                submitAttempts = 0;
                if (browser) {
                    try {
                        localStorage.setItem('submitAttempts', '0');
                    } catch (e) {
                        console.error('Could not save to local storage:', e);
                    }
                }
            } else {
                throw new Error('Received response from Formspree but success confirmation was missing');
            }
        } catch (error: unknown) {
            console.error('Form submission error:', error);
            
            // Type guard to handle error properly
            const errorMsg = error instanceof Error 
                ? error.message 
                : 'Unknown error occurred';
            
            // More descriptive error message with debugging info
            if (errorMsg.includes('NetworkError') || errorMsg.includes('Failed to fetch')) {
                errorMessage = 'Network error: Could not connect to the form service. Please check your internet connection and try again.';
            } else if (errorMsg.includes('URL is not configured') || errorMsg.includes('not properly configured')) {
                errorMessage = 'Configuration error: The form submission service is not properly configured. Please check if your Formspree form ID is correct.';
            } else {
                errorMessage = `Error: ${errorMsg || 'Unknown error occurred. Please try again later.'}`;
            }
        } finally {
            isSubmitting = false;
        }
    }
    
    function resetForm(): void {
        email = '';
        message = '';
        honeypot = '';
        isSuccess = false;
        errorMessage = '';
        csrfToken = generateCSRFToken();
        tosAgreed = false;
    }
    
    // Handle clicking outside the modal to close it
    function handleClickOutside(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-overlay')) {
            closeTosModal();
        }
    }
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8B195] to-[#F67280] p-6">
    <div class="w-full max-w-lg bg-white bg-opacity-95 rounded-lg shadow-lg p-6 text-center">
        <h1 class="text-2xl font-extrabold text-[#2E4057] mb-4">Contact Us</h1>
      
        {#if !isSuccess}
            <p class="text-lg text-[#2E4057] leading-relaxed mb-6">
                We'd love to hear from you! Send us a message and we'll get back to you soon.
            </p>
        
            <form on:submit={handleSubmit} class="space-y-6">
                <input type="hidden" name="_csrf" value={csrfToken} />
                <!-- Add Formspree specific redirect field -->
                <input type="hidden" name="_next" value={browser ? window.location.href + '?formspree_form_submission=success' : ''} />
                
                <!-- Honeypot field - invisible to humans but bots will fill it -->
                <div class="hidden" aria-hidden="true">
                    <input 
                        type="text" 
                        name="_gotcha" 
                        bind:value={honeypot} 
                        tabindex="-1" 
                        autocomplete="off" 
                    />
                </div>
                
                <div class="text-left">
                    <label for="email" class="block text-lg font-bold text-[#2E4057] mb-2">
                        Your email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        bind:value={email}
                        class="w-full px-4 py-3 border-2 border-[#F8B195] rounded-lg focus:outline-none focus:border-[#F67280] focus:ring-2 focus:ring-[#F67280] transition-all text-[#2E4057]"
                        placeholder="example@domain.com"
                        maxlength="100"
                        autocomplete="email"
                        required
                    />
                </div>
          
                <div class="text-left">
                    <label for="message" class="block text-lg font-bold text-[#2E4057] mb-2">
                        Your message:
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        bind:value={message}
                        class="w-full px-4 py-3 border-2 border-[#F8B195] rounded-lg focus:outline-none focus:border-[#F67280] focus:ring-2 focus:ring-[#F67280] transition-all text-[#2E4057] min-h-32 resize-y"
                        placeholder="What would you like to tell us?"
                        maxlength="1000"
                        required
                    ></textarea>
                </div>
          
                {#if errorMessage}
                    <p class="text-[#F67280] font-medium">{errorMessage}</p>
                {/if}
                
                <!-- Add form diagnostics info for debugging -->
                {#if !formspreeUrl || !verifyFormspreeUrl()}
                    <p class="text-[#F67280] text-sm font-medium">
                        Warning: Formspree URL not properly configured. Check your environment variables.
                    </p>
                {/if}
          
                <div class="flex flex-col md:flex-row justify-center gap-4 w-full mt-6">
                    <button 
                        type="submit" 
                        class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#F67280] text-white rounded-lg hover:bg-[#E56270] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {#if isSubmitting}
                            <span class="inline-block">Sending...</span>
                        {:else}
                            ✉️ Send
                        {/if}
                    </button>
                    
                    <button 
                        type="button"
                        on:click={resetForm}
                        class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#6C5B7B] text-white rounded-lg hover:bg-[#5D4C6C] transition-all"
                    >
                        🔄 Reset
                    </button>
                </div>
            </form>
        {:else}
            <div class="py-8 flex flex-col items-center">
                <p class="text-xl font-semibold text-[#F67280] mb-4">
                    Your message has been sent successfully! Thank you for reaching out.
                </p>
                
                <p class="text-md text-[#2E4057] mb-6">
                    We'll respond to your email as soon as possible. If you don't receive a confirmation email from Formspree, please check your spam folder.
                </p>
                
                <button 
                    on:click={resetForm}
                    class="px-4 py-2 bg-[#F67280] text-white rounded-full hover:bg-[#F8B195] transition-all"
                >
                    Send another message
                </button>
            </div>
        {/if}
    </div>
</div>

<!-- Terms of Service and Privacy Policy Modal -->
{#if showTosModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
        class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
        on:click={handleClickOutside}
    >
        <div class="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-[#2E4057]">Terms of Service & Privacy Policy</h2>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button 
                        on:click={closeTosModal}
                        class="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="mb-6 overflow-y-auto max-h-80 text-left text-sm px-2">
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-[#2E4057]">Terms of Service</h3>
                        <p class="text-sm text-gray-600 mb-2">Last updated: March 10, 2025</p>
                        
                        <h4 class="font-medium text-[#2E4057]">1. Acceptance of Terms</h4>
                        <p>
                            By accessing or using the CraveSpin application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">2. User Conduct</h4>
                        <p>
                            When using our Service, you agree to:
                        </p>
                        <ul class="list-disc ml-6 space-y-1">
                            <li>Use the Service for casual, non-commercial purposes only</li>
                            <li>Not submit spam, abusive, hateful, or offensive content</li>
                            <li>Not attempt to circumvent any security features of the Service</li>
                            <li>Not use the Service for any illegal activities</li>
                            <li>Not impersonate others or provide false information</li>
                        </ul>
                        <p>We reserve the right to terminate access to users who violate these terms.</p>
                        
                        <h4 class="font-medium text-[#2E4057]">3. Content Disclaimer</h4>
                        <p>
                            The Service is not intended to provide health-related information, financial advice, legal counsel, or professional services. Content is provided for entertainment and informational purposes only.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">4. Communication</h4>
                        <p>
                            By submitting a form on our Service, you grant us permission to respond to your inquiry via the email you've provided. We may occasionally send service-related announcements but will not add you to marketing lists without explicit consent.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">5. Intellectual Property</h4>
                        <p>
                            All content created by CraveSpin, including original text, graphics, logos, and code, is owned by CraveSpin and protected under applicable copyright and intellectual property laws.
                        </p>
                        <p>
                            Third-party software, such as SvelteKit, and AI-generated code, text, and graphics are used in accordance with their respective licenses.
                        </p>
                        <p>
                            You may not reproduce, distribute, or create derivative works of CraveSpin's original content without our express permission.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">6. Limitation of Liability</h4>
                        <p>
                            To the maximum extent permitted by law, CraveSpin shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">7. Changes to Terms</h4>
                        <p>
                            We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and potentially providing additional notification.
                        </p>
                        <p>
                            Your continued use of the Service after such changes constitutes your acceptance of the new terms.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">8. Contact Information</h4>
                        <p>
                            For questions about these Terms, please contact us through our Contact form.
                        </p>
                        
                        <h3 class="text-lg font-semibold text-[#2E4057] mt-8 pt-4 border-t border-gray-200">Privacy Policy</h3>
                        <p class="text-sm text-gray-600 mb-2">Last updated: March 10, 2025</p>
                        
                        <h4 class="font-medium text-[#2E4057]">1. Information We Collect</h4>
                        <p>We collect the following personal information when you interact with our Service:</p>
                        <ul class="list-disc ml-6 space-y-1">
                            <li>Contact information (email address)</li>
                            <li>Message content you provide</li>
                            <li>Device and browser information (IP address, browser type, device type)</li>
                            <li>Usage data (pages visited, interaction patterns)</li>
                        </ul>
                        
                        <h4 class="font-medium text-[#2E4057]">2. How We Use Your Information</h4>
                        <p>We use your information for the following purposes:</p>
                        <ul class="list-disc ml-6 space-y-1">
                            <li>To respond to your inquiries and messages</li>
                            <li>To provide and maintain our Service</li>
                            <li>To improve our user experience</li>
                            <li>To detect and prevent technical issues</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                        <p>Your email will only be used to respond to your message and will not be added to marketing lists without your explicit consent.</p>
                        
                        <h4 class="font-medium text-[#2E4057]">3. Third-Party Services</h4>
                        <p>
                            We use Formspree to process form submissions. By using our contact form, you acknowledge that your information will be transferred to Formspree for processing in accordance with their terms of service and privacy policy.
                        </p>
                        <p>
                            We use anonymous analytics tools to improve our Service. These tools collect information sent by your browser, including device information and interactions with our Service.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">4. Cookies and Tracking</h4>
                        <p>
                            Our Service uses essential cookies that are necessary for its proper functioning. We also use analytics cookies to understand how visitors interact with our website. These cookies collect information anonymously.
                        </p>
                        <p>
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our Service may not function properly.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">5. Data Retention</h4>
                        <p>
                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including responding to your inquiries and complying with legal obligations.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">6. Your Rights</h4>
                        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                        <ul class="list-disc ml-6 space-y-1">
                            <li>Access to your personal data</li>
                            <li>Correction of inaccurate data</li>
                            <li>Deletion of your personal data</li>
                            <li>Restriction of processing</li>
                            <li>Data portability</li>
                            <li>Objection to processing</li>
                        </ul>
                        <p>To exercise these rights, please contact us through our Contact form.</p>
                        
                        <h4 class="font-medium text-[#2E4057]">7. Children's Privacy</h4>
                        <p>
                            Our Service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If we discover that a child under 16 has provided us with personal information, we will promptly delete it.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">8. Changes to This Privacy Policy</h4>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                        
                        <h4 class="font-medium text-[#2E4057]">9. Contact Us</h4>
                        <p>
                            For any questions about this Privacy Policy, please contact us through our Contact form.
                        </p>
                    </div>
                    
                    <div class="mt-6 pt-6 border-t border-[#F2F2F2] text-center text-sm text-[#2E4057]">
                        <p>
                            By submitting this form, you acknowledge that you have read and agree to our Terms of Service and Privacy Policy as outlined above.
                        </p>
                    </div>
                </div>
                
                <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end">
                    <button 
                        on:click={closeTosModal}
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                    >
                        Decline
                    </button>
                    <button 
                        on:click={agreeTos}
                        class="px-4 py-2 bg-[#F67280] text-white rounded-lg hover:bg-[#E56270] transition-all"
                    >
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}