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

  function selectMood(mood) {
    selectedMood = mood;
    rotateSection(2);
  }

  function selectWeather(weather) {
    selectedWeather = weather;
    rotateSection(3);
  }

  function selectPlace(place) {
    selectedPlace = place;
    handleSubmit();
  }

  function rotateSection(step) {
    currentStep = step;
  }
  
  function goBack() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(event, action) {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  }
</script>

<div class="adventure-container">
  <div class="adventure-finder">
    <!-- Title that changes based on step -->
    <h1 class="title">
      {#if currentStep === 1}
        How are you feeling today?
      {:else if currentStep === 2}
        How's the weather?
      {:else}
        Where are you?
      {/if}
    </h1>
    
    <!-- Steps indicator -->
    <div class="steps" role="tablist" aria-label="Progress steps">
      <button 
        class="step {currentStep >= 1 ? 'active' : ''}" 
        role="tab"
        aria-selected={currentStep === 1}
        aria-label="Step 1: Feeling"
        on:click={() => currentStep = 1}
        on:keydown={(e) => handleKeyDown(e, () => currentStep = 1)}
      ></button>
      <button 
        class="step {currentStep >= 2 ? 'active' : ''}" 
        role="tab"
        aria-selected={currentStep === 2}
        aria-label="Step 2: Weather"
        on:click={() => currentStep > 1 ? currentStep = 2 : null}
        on:keydown={(e) => handleKeyDown(e, () => currentStep > 1 ? currentStep = 2 : null)}
        tabindex={currentStep > 1 ? 0 : -1}
      ></button>
      <button 
        class="step {currentStep >= 3 ? 'active' : ''}" 
        role="tab"
        aria-selected={currentStep === 3}
        aria-label="Step 3: Location"
        on:click={() => currentStep > 2 ? currentStep = 3 : null}
        on:keydown={(e) => handleKeyDown(e, () => currentStep > 2 ? currentStep = 3 : null)}
        tabindex={currentStep > 2 ? 0 : -1}
      ></button>
    </div>
    
    <!-- Content container with options -->
    <div class="content-box" role="tabpanel">
      <!-- Mood Selection -->
      {#if currentStep === 1}
        <div class="options-grid">
          {#each moods as mood}
            <button 
              on:click={() => selectMood(mood)} 
              class="option-tile {selectedMood === mood ? 'selected' : ''}">
              {mood}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Weather Selection -->
      {#if currentStep === 2}
        <div class="options-grid">
          {#each weathers as weather}
            <button 
              on:click={() => selectWeather(weather)} 
              class="option-tile {selectedWeather === weather ? 'selected' : ''}">
              {weather}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Place Selection -->
      {#if currentStep === 3}
        <div class="options-grid">
          {#each places as place}
            <button 
              on:click={() => selectPlace(place)} 
              class="option-tile {selectedPlace === place ? 'selected' : ''}">
              {place}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Navigation -->
      <div class="nav-controls">
        {#if currentStep > 1}
          <button class="nav-btn back" on:click={goBack} aria-label="Go back">←</button>
        {:else}
          <div></div> <!-- Empty div for spacing -->
        {/if}
        
        {#if currentStep < 3 && ((currentStep === 1 && selectedMood) || (currentStep === 2 && selectedWeather))}
          <button class="nav-btn next" on:click={() => rotateSection(currentStep + 1)} aria-label="Continue to next step">→</button>
        {:else if currentStep === 3}
          <div></div> <!-- Empty div for spacing -->
        {/if}
      </div>

      <!-- Selection summary -->
      <div class="selection-summary" aria-live="polite">
        {#if selectedMood}
          <span class="tag mood">{selectedMood}</span>
        {/if}
        {#if selectedWeather}
          <span class="tag weather">{selectedWeather}</span>
        {/if}
        {#if selectedPlace}
          <span class="tag place">{selectedPlace}</span>
        {/if}
      </div>
    </div>

    <!-- Error Message -->
    {#if formError}
      <p class="error" role="alert">All options must be selected</p>
    {/if}

    <!-- Loading State -->
    {#if isLoading}
      <div class="loading" aria-live="assertive" aria-label="Loading">
        <div class="spinner" aria-hidden="true"></div>
        <span class="sr-only">Loading...</span>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600&display=swap');

  * {
    box-sizing: border-box;
    font-family: 'Baloo 2', cursive;
  }

  /* Background Design */
  .adventure-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #FF6347, #FFD700); /* Tomato Red to Lemon Yellow gradient */
    padding: 20px;
  }

  .adventure-finder {
    width: 100%;
    max-width: 500px;
    text-align: center;
  }

  .title {
    color: #333333;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .steps {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .step {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ddd;
    cursor: pointer;
    transition: transform 0.3s, background 0.3s;
    border: none;
    padding: 0;
  }

  .step.active {
    background: #FF6347;
    transform: scale(1.2);
  }

  .step:focus {
    outline: 2px solid #FF6347;
    outline-offset: 2px;
  }

  .content-box {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .content-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: #FFD700;
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  }

  .option-tile {
    background: white;
    border: 2px solid #eee;
    border-radius: 10px;
    padding: 15px 10px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    transition: all 0.25s;
  }

  .option-tile:hover {
    border-color: #FFA500;
    transform: translateY(-3px);
  }

  .option-tile:focus {
    outline: 2px solid #FF6347;
    outline-offset: 2px;
  }

  .option-tile.selected {
    background: #FF6347;
    color: white;
    border-color: #FF6347;
    font-weight: bold;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 99, 71, 0.3);
  }

  .nav-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .nav-btn:focus {
    outline: 2px solid #FF6347;
    outline-offset: 2px;
  }

  .nav-btn.back {
    background: #f0f0f0;
    color: #333;
  }

  .nav-btn.back:hover {
    background: #e0e0e0;
  }

  .nav-btn.next {
    background: #FF6347;
    color: white;
  }

  .nav-btn.next:hover {
    background: #FF4136;
    transform: scale(1.1);
  }

  .selection-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 15px;
    justify-content: center;
  }

  .tag {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
  }

  .tag.mood {
    background: #FFD700;
    color: #333;
  }

  .tag.weather {
    background: #FFA500;
    color: white;
  }

  .tag.place {
    background: #98FB98;
    color: #333;
  }

  .error {
    color: #FF4136;
    margin-top: 10px;
    font-size: 14px;
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #FF6347;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
