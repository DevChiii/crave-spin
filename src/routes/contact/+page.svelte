<script>
    import { onMount } from 'svelte';
    
    let email = '';
    let message = '';
    let errorMessage = '';
    let isSubmitting = false;
    let isSuccess = false;
    
    // This would come from your environment variables in SvelteKit
    const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL;
    
    function handleSubmit(event) {
      // Clear previous errors
      errorMessage = '';
      
      // Validate form
      if (!email || !message) {
        errorMessage = 'Both fields are required.';
        event.preventDefault(); // Prevent form submission
        return;
      }
      
      // Show submitting state
      isSubmitting = true;
      
      // For demo purposes, simulate submission response
      // In production, this would be handled by the actual form submission
      setTimeout(() => {
        isSubmitting = false;
        isSuccess = true;
      }, 1000);
    }
    
    function resetForm() {
      email = '';
      message = '';
      isSuccess = false;
    }
  </script>
  
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8B195] to-[#F67280] p-6">
    <div class="w-full max-w-lg bg-white bg-opacity-95 rounded-lg shadow-lg p-6 text-center">
      <h1 class="text-2xl font-extrabold text-[#2E4057] mb-4">Contact Us</h1>
      
      {#if !isSuccess}
        <p class="text-lg text-[#2E4057] leading-relaxed mb-6">
          We'd love to hear from you! Send us a message and we'll get back to you soon.
        </p>
        
        <form action={formspreeUrl} method="POST" on:submit={handleSubmit} class="space-y-6">
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
              type="reset"
              on:click={() => {email = ''; message = '';}}
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