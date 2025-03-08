<script>
  import { goto } from '$app/navigation';
  import { userData } from '../lib/stores/store.js';

  let moods = ["Happy", "Hungry", "Adventurous", "Lazy", "Sad"];
  let selectedMood = "";
  let selectedWeather = "";
  let selectedPlace = "";
  let weathers = ["Hot", "Cold", "Sunny", "Rainy", "Cool", "Windy"];
  let places = ["Beach", "Mountain", "City", "Countryside"];
  let isLoading = false;
  let formError = false;
  let currentStep = 1;
  // @ts-ignore
  /**
	 * @type {string | null}
	 */
  let lastClickedOption = null;
  
  function handleSubmit() {
    if (!selectedMood || !selectedWeather || !selectedPlace) {
      formError = true;
      return;
    }

    formError = false;

    userData.set({
      mood: selectedMood,
      weather: selectedWeather,
      place: selectedPlace
    });

    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      goto('/roulette');
    }, 1000);
  }

  // @ts-ignore
  function selectMood(mood) {
    selectedMood = mood;
    applyClickEffect(mood);
    setTimeout(() => rotateSection(2), 300);
  }

  // @ts-ignore
  function selectWeather(weather) {
    selectedWeather = weather;
    applyClickEffect(weather);
    setTimeout(() => rotateSection(3), 300);
  }

  // @ts-ignore
  function selectPlace(place) {
    selectedPlace = place;
    applyClickEffect(place);
    setTimeout(() => handleSubmit(), 300);
  }

  // @ts-ignore
  function rotateSection(step) {
    currentStep = step;
  }
  
  function goBack() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  // @ts-ignore
  function handleKeyDown(event, action) {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  }
  
  // @ts-ignore
  function applyClickEffect(option) {
    lastClickedOption = option;
    // Reset after animation completes
    setTimeout(() => {
      lastClickedOption = null;
    }, 500);
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8B195] to-[#F67280] p-6">
  <div class="w-full max-w-lg bg-white bg-opacity-95 rounded-lg shadow-lg p-6 text-center">
    
    <!-- Title that changes based on step -->
    <h1 class="text-2xl font-extrabold text-[#2E4057] mb-4">
      {#if currentStep === 1}
        How are you feeling today?
      {:else if currentStep === 2}
        How's the weather?
      {:else}
        Where are you?
      {/if}
    </h1>
    
    <!-- Steps indicator -->
    <div class="flex justify-center gap-3 mb-6" role="tablist" aria-label="Progress steps">
      <button 
        class="w-3 h-3 rounded-full transition-all {currentStep >= 1 ? 'bg-[#F67280] scale-110' : 'bg-gray-300'}" 
        role="tab"
        aria-selected={currentStep === 1}
        aria-label="Step 1: Feeling"
        on:click={() => currentStep = 1}
        on:keydown={(e) => handleKeyDown(e, () => currentStep = 1)}
      ></button>
      <button 
        class="w-3 h-3 rounded-full transition-all {currentStep >= 2 ? 'bg-[#F67280] scale-110' : 'bg-gray-300'}" 
        role="tab"
        aria-selected={currentStep === 2}
        aria-label="Step 2: Weather"
        on:click={() => currentStep > 1 ? currentStep = 2 : null}
        on:keydown={(e) => handleKeyDown(e, () => currentStep > 1 ? currentStep = 2 : null)}
        tabindex={currentStep > 1 ? 0 : -1}
      ></button>
      <button 
        class="w-3 h-3 rounded-full transition-all {currentStep >= 3 ? 'bg-[#F67280] scale-110' : 'bg-gray-300'}" 
        role="tab"
        aria-selected={currentStep === 3}
        aria-label="Step 3: Location"
        on:click={() => currentStep > 2 ? currentStep = 3 : null}
        on:keydown={(e) => handleKeyDown(e, () => currentStep > 2 ? currentStep = 3 : null)}
        tabindex={currentStep > 2 ? 0 : -1}
      ></button>
    </div>
    
    <!-- Content container with options -->
    <div class="bg-white rounded-lg relative overflow-hidden" role="tabpanel">
      <!-- Purple accent bar at top -->
      <div class="h-1 w-full bg-[#6C5B7B] absolute top-0 left-0"></div>
      
      <div class="p-6">
        <!-- Mood Selection -->
        {#if currentStep === 1}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each moods as mood}
              <button 
                on:click={() => selectMood(mood)} 
                class="py-3 px-2 rounded-lg border-2 text-lg transition-all {selectedMood === mood ? 'bg-[#F67280] text-white border-[#F67280] font-bold -translate-y-1 shadow-md' : 'border-gray-200 text-[#2E4057] hover:border-[#F8B195] hover:-translate-y-1'} {lastClickedOption === mood ? 'click-effect' : ''}">
                {mood}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Weather Selection -->
        {#if currentStep === 2}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each weathers as weather}
              <button 
                on:click={() => selectWeather(weather)} 
                class="py-3 px-2 rounded-lg border-2 text-lg transition-all {selectedWeather === weather ? 'bg-[#F67280] text-white border-[#F67280] font-bold -translate-y-1 shadow-md' : 'border-gray-200 text-[#2E4057] hover:border-[#F8B195] hover:-translate-y-1'} {lastClickedOption === weather ? 'click-effect' : ''}">
                {weather}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Place Selection -->
        {#if currentStep === 3}
          <div class="grid grid-cols-2 gap-3">
            {#each places as place}
              <button 
                on:click={() => selectPlace(place)} 
                class="py-3 px-2 rounded-lg border-2 text-lg transition-all {selectedPlace === place ? 'bg-[#F67280] text-white border-[#F67280] font-bold -translate-y-1 shadow-md' : 'border-gray-200 text-[#2E4057] hover:border-[#F8B195] hover:-translate-y-1'} {lastClickedOption === place ? 'click-effect' : ''}">
                {place}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Navigation -->
        <div class="flex justify-between mt-6">
          {#if currentStep > 1}
            <button 
              class="w-10 h-10 rounded-full bg-gray-100 text-[#2E4057] flex items-center justify-center text-xl transition-all hover:bg-gray-200 active:scale-95" 
              on:click={goBack} 
              aria-label="Go back">
              ←
            </button>
          {:else}
            <div></div> <!-- Empty div for spacing -->
          {/if}
          
          {#if currentStep < 3 && ((currentStep === 1 && selectedMood) || (currentStep === 2 && selectedWeather))}
            <button 
              class="w-10 h-10 rounded-full bg-[#F67280] text-white flex items-center justify-center text-xl transition-all hover:bg-[#E56270] hover:scale-110 active:scale-95" 
              on:click={() => rotateSection(currentStep + 1)} 
              aria-label="Continue to next step">
              →
            </button>
          {:else if currentStep === 3}
            <div></div> <!-- Empty div for spacing -->
          {/if}
        </div>

        <!-- Selection summary -->
        <div class="flex flex-wrap gap-2 mt-6 justify-center" aria-live="polite">
          {#if selectedMood}
            <span class="px-3 py-1 rounded-full text-sm font-bold bg-[#F8B195] text-[#2E4057]">{selectedMood}</span>
          {/if}
          {#if selectedWeather}
            <span class="px-3 py-1 rounded-full text-sm font-bold bg-[#F67280] text-white">{selectedWeather}</span>
          {/if}
          {#if selectedPlace}
            <span class="px-3 py-1 rounded-full text-sm font-bold bg-[#6C5B7B] text-white">{selectedPlace}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Error Message -->
    {#if formError}
      <p class="text-[#E56270] mt-4 text-lg" role="alert">All options must be selected</p>
    {/if}

    <!-- Loading State -->
    {#if isLoading}
      <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" aria-live="assertive" aria-label="Loading">
        <div class="w-12 h-12 border-4 border-[rgba(255,255,255,0.3)] border-t-[#F67280] rounded-full animate-spin" aria-hidden="true"></div>
        <span class="sr-only">Loading...</span>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&display=swap');

  :global(*) {
    box-sizing: border-box;
    font-family: 'Baloo 2', cursive;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Smoother click effect animation */
  @keyframes clickPulse {
    0% { transform: scale(1); }
    40% { transform: scale(0.95); box-shadow: 0 0 0 6px rgba(246, 114, 128, 0.3); }
    100% { transform: scale(1); }
  }
  
  .click-effect {
    animation: clickPulse 0.4s ease-out;
    background-color: rgba(246, 114, 128, 0.1);
  }
  
  /* Smooth transitions for button hover and selected states */
  button {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.3s ease-in-out;
  }
  
  button:hover {
    transform: translateY(-2px); /* Slight hover lift */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  button:active {
    transform: scale(0.98); /* Slight shrink on click */
  }

  button:focus-visible {
    outline: 2px solid #F67280;
    outline-offset: 2px;
  }

  /* Active state for selected buttons */
  /* .selected {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(246, 114, 128, 0.2);
  } */

  /* Enhanced focus styles */
  button:focus-visible {
    outline: 2px solid #F67280;
    outline-offset: 2px;
  }

  /* Pulse for selection tags */
  @keyframes tagPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* .selection-summary span {
    animation: tagPulse 1s ease-in-out;
  } */
  
  /* Button states for selection */
  /* .options-grid button {
    transition: transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.2s ease-in-out;
  } */
</style>
