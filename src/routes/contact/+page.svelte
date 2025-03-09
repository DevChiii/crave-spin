<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    // @ts-ignore
    import { goto } from '$app/navigation';
    
    let email = '';
    let message = '';
    let errorMessage = '';
    let isSubmitting = false;
    let isSuccess = false;
    let csrfToken = '';
    let honeypot = ''; // Honeypot field to catch bots
    let submitAttempts = 0;
    let lastSubmitTime = 0;
    
    // This would come from your environment variables in SvelteKit
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
        }
    });
    
    function generateCSRFToken() {
        // In production, this would be handled by your server
        return 'csrf-' + Math.random().toString(36).substring(2) + Date.now();
    }
    
    // @ts-ignore
    function validateEmail(email) {
        // More comprehensive email validation
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(email);
    }
    
    // @ts-ignore
    function sanitizeInput(input) {
        // More thorough sanitization
        if (!input) return '';
        
        return String(input)
            // @ts-ignore
            .replace(/[&<>"'`=\/]/g, function(match) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '/': '&#x2F;',
                    '`': '&#x60;',
                    '=': '&#x3D;'
                }[match];
            })
            .trim();
    }
    
    // @ts-ignore
    function isSpam(text) {
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
    
    // @ts-ignore
    async function handleSubmit(event) {
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
            // Pretend success but don't actually submit
            isSuccess = true;
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
            errorMessage = 'Message is too short.';
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
            
            // In production, use fetch to submit the form
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest' // Helps prevent CSRF
                },
                body: JSON.stringify({
                    email: sanitizedEmail,
                    message: sanitizedMessage,
                    timestamp: new Date().toISOString(),
                    _csrf: csrfToken
                }),
                credentials: 'same-origin' // Important for CSRF protection
            });
            
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Form submission failed');
            }
            
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
        } catch (error) {
            errorMessage = 'An error occurred. Please try again later.';
            console.error('Form submission error:', error);
        } finally {
            isSubmitting = false;
        }
    }
    
    function resetForm() {
        email = '';
        message = '';
        honeypot = '';
        isSuccess = false;
        errorMessage = '';
        // Refresh CSRF token for new submission
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
                
                <!-- Honeypot field - invisible to humans but bots will fill it -->
                <div class="hidden" aria-hidden="true">
                    <input 
                        type="text" 
                        name="website" 
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
                <div class="w-16 h-16 bg-[#F67280] rounded-full flex items-center justify-center mb-4">
                    <span class="text-white text-2xl">✓</span>
                </div>
                <h2 class="text-xl font-bold text-[#F67280] mb-2">Message Sent!</h2>
                <p class="text-lg text-[#2E4057] mb-6">Thank you for reaching out to us.</p>
                <button 
                    on:click={resetForm}
                    class="px-4 py-2 text-md md:text-lg font-bold bg-[#F67280] text-white rounded-lg hover:bg-[#E56270] transition-all"
                >
                    Send Another Message
                </button>
            </div>
        {/if}
    </div>
</div>