<!-- src/routes/index.svelte -->
<script>
  import { goto } from '$app/navigation';
  import { userData } from '../lib/stores/store.js'; // Import the store

  let moods = ["Happy", "Hungry", "Adventurous", "Lazy", "Sad"];
  let selectedMood = "";
  let userCountry = "";
  let selectedWeather = "";
  let weathers = ["Hot", "Cold", "Sunny", "Rainy", "Cool", "Windy"];
  let isLoading = false;
  let formError = false;

  function handleSubmit() {
    // Check if all required fields are filled
    if (!selectedMood || !selectedWeather || (userCountry !== "" && userCountry !== "All" && !userCountry)) {
      formError = true;
      return;
    }

    formError = false;

    // Save the data to the store before navigating
    userData.set({
      mood: selectedMood,
      country: userCountry,
      weather: selectedWeather
    });

    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      goto('/roulette');  // Redirect to the /roulette page
    }, 1000);
  }
</script>

<div class="p-6 text-center">
  <h1 class="text-2xl font-bold mb-4">How are you feeling today?</h1>

  <!-- Country Selection -->
  <label for="country" class="block text-lg mb-2">Which country are you in?</label>
  <select id="country" bind:value={userCountry} class="p-2 border rounded w-full mb-4">
    <option value="" disabled selected>Select your country...</option>
    <option value="PH">Philippines (PH)</option>
    <option value="All">All</option>
  </select>

  <!-- Weather Selection -->
  <label for="weather" class="block text-lg mb-2">How’s the weather?</label>
  <select id="weather" bind:value={selectedWeather} class="p-2 border rounded w-full mb-4">
    <option value="" disabled selected>Select weather...</option>
    {#each weathers as weather}
      <option value={weather}>{weather}</option>
    {/each}
  </select>

  <!-- Mood Selection -->
  <label for="mood" class="block text-lg mb-2">How are you feeling today?</label>
  <select id="mood" bind:value={selectedMood} class="p-2 border rounded w-full">
    <option value="" disabled selected>Select your mood...</option>
    {#each moods as mood}
      <option value={mood}>{mood}</option>
    {/each}
  </select>

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
  {#if !isLoading && selectedWeather && selectedMood && userCountry !== "All" && userCountry !== ""}
    <p class="mt-4 text-lg">
      You are in <strong>{userCountry}</strong>, the weather is <strong>{selectedWeather}</strong>,
      and you are feeling <strong class="text-blue-500">{selectedMood}</strong>.
    </p>
  {/if}

  {#if !isLoading && userCountry === "All" && selectedWeather && selectedMood}
    <p class="mt-4 text-lg">
      You selected "All" countries, the weather is <strong>{selectedWeather}</strong>,
      and you are feeling <strong class="text-blue-500">{selectedMood}</strong>.
    </p>
  {/if}

  <!-- Submit Button -->
  <button on:click={handleSubmit} class="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Submit
  </button>
</div>

<style>
  /* Adding the spinning animation */
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
