<script>
  import { goto } from '$app/navigation';
  import { userData } from '../lib/stores/store.js'; // Import the store

  let moods = ["Happy", "Hungry", "Adventurous", "Lazy", "Sad"];
  let selectedMood = "";
  let selectedWeather = "";
  let selectedPlace = "";
  let weathers = ["Hot", "Cold", "Sunny", "Rainy", "Cool", "Windy"];
  let places = ["Beach", "Mountain", "City", "Countryside"];
  let isLoading = false;
  let formError = false;
  let currentStep = 1; // To track which step we're on (1: Mood, 2: Weather, 3: Place)

  function handleSubmit() {
    // Check if all required fields are filled
    if (!selectedMood || !selectedWeather || !selectedPlace) {
      formError = true;
      return;
    }

    formError = false;

    // Save the data to the store before navigating
    userData.set({
      mood: selectedMood,
      weather: selectedWeather,
      place: selectedPlace
    });

    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      goto('/roulette');  // Redirect to the /roulette page
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
</script>

<div class="container">
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold mb-4">How are you feeling today?</h1>

    <!-- Mood Selection -->
    {#if currentStep === 1}
      <div class="input-box mood-selection active">
        <label for="mood" class="block text-lg mb-2">How are you feeling today?</label>
        <div class="options">
          {#each moods as mood}
            <button on:click={() => selectMood(mood)} class="option-btn">{mood}</button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Weather Selection -->
    {#if currentStep === 2}
      <div class="input-box weather-selection active">
        <label for="weather" class="block text-lg mb-2">How’s the weather?</label>
        <div class="options">
          {#each weathers as weather}
            <button on:click={() => selectWeather(weather)} class="option-btn">{weather}</button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Place Selection -->
    {#if currentStep === 3}
      <div class="input-box place-selection active">
        <label for="place" class="block text-lg mb-2">Where are you?</label>
        <div class="options">
          {#each places as place}
            <button on:click={() => selectPlace(place)} class="option-btn">{place}</button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Form Error Message -->
    {#if formError}
      <p class="text-red-500 mt-4">Please fill out all the fields before submitting.</p>
    {/if}

    <!-- Loading Spinner -->
    {#if isLoading}
      <div class="mt-4">
        <div class="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        <p class="text-lg mt-2">Loading...</p>
      </div>
    {/if}

    <!-- Results -->
    {#if !isLoading && selectedWeather && selectedMood && selectedPlace}
      <p class="mt-4 text-lg">
        You are feeling <strong>{selectedMood}</strong>, the weather is <strong>{selectedWeather}</strong>,
        and you are at the <strong>{selectedPlace}</strong>.
      </p>
    {/if}

  </div>
</div>

<style>
  /* Full screen container with flex to center content */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 20px;
    background-color: #F5F5DC; /* Background Beige */
  }

  .input-box {
    display: none;
    text-align: center;
    perspective: 1000px; /* Give a 3D perspective to the box */
    animation: rollForward 0.6s ease-out forwards;
  }

  .input-box.active {
    display: block;
  }

  @keyframes rollForward {
    0% {
      opacity: 0;
      transform: rotateX(-90deg) translateY(50px);
    }
    100% {
      opacity: 1;
      transform: rotateX(0deg) translateY(0);
    }
  }

  .options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }

  .option-btn {
    background-color: #FF6347; /* Primary Red */
    color: #F5F5DC; /* Background Beige */
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .option-btn:hover {
    background-color: #FFA500; /* Accent Orange */
  }

  /* Responsive Styling */
  @media (max-width: 768px) {
    .input-box {
      padding: 20px;
    }
    .options {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }

  /* Style the error and loading spinner */
  .text-red-500 {
    color: #FF6347;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
