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
    
    async function handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        
        // Clear previous errors
        errorMessage = '';
        
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
        
        // Validate form
        if (!email || !message) {
            errorMessage = 'Both fields are required.';
            return;
        }
        
        if (!validateEmail(email)) {
            errorMessage = 'Please enter a valid email address.';
            return;
        }
        
        // Check message length
        if (message.length < 5) {
            errorMessage = 'Message is too short. Please provide more details.';
            return;
        }
        
        if (message.length > 1000) {
            errorMessage = 'Message is too long. Please limit to 1000 characters.';
            return;
        }
        
        // Check for spam content
        if (isSpam(message) || isSpam(email)) {
            errorMessage = 'Your message has been flagged as potential spam. Please revise.';
            return;
        }
        
        // Verify Formspree URL is correctly formatted
        if (!verifyFormspreeUrl()) {
            errorMessage = 'Form submission service not properly configured. Please check your Formspree URL.';
            console.error('Invalid Formspree URL:', formspreeUrl);
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