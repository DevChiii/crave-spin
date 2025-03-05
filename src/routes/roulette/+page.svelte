<script>
  import { userData } from '../../lib/stores/store.js'; // Import the store

  /** 
   * @type {Array<{ id: number, name: string, image: string, moods: string[], weather: string[] }>}
   */
  let foodSuggestions = [];
  let isLoading = true; // State to track loading

  /**
   * Fetches food data and filters it based on mood and weather
   * @returns {Promise<void>}
   */
  async function fetchFoodData() {
    try {
      const response = await fetch('/data/foodDatabase.json');
      const foodDatabase = await response.json();
      foodSuggestions = foodDatabase.foods.filter((/** @type {{ id: number, name: string, image: string, moods: string[], weather: string[] }} */ food) =>
        food.moods.includes($userData.mood) && food.weather.includes($userData.weather)
      );
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      isLoading = false; // Set loading state to false once data is fetched
    }
  }

  // Fetch food data when the component mounts
  fetchFoodData();
</script>

<div class="p-6 text-center">
  <h1 class="text-2xl font-bold mb-4">Your Selections</h1>

  {#if $userData.mood}
    <p class="mt-4 text-lg">
      You are in <strong>{$userData.country}</strong>, the weather is <strong>{$userData.weather}</strong>,
      and you are feeling <strong class="text-blue-500">{$userData.mood}</strong>.
    </p>
  {/if}

  <h2 class="text-xl font-semibold mt-6 mb-4">Food Suggestions</h2>

  {#if isLoading}
    <p class="mt-4 text-lg text-gray-500">Loading food suggestions...</p>
  {:else if foodSuggestions.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each foodSuggestions as food}
        <div class="border rounded-lg p-4 text-center">
          <img src={food.image} alt={food.name} class="w-full h-40 object-cover rounded-md mb-4" />
          <h3 class="text-lg font-semibold">{food.name}</h3>
        </div>
      {/each}
    </div>
  {:else}
    <p class="mt-4 text-lg text-red-500">No food suggestions found for your mood and weather.</p>
  {/if}
</div>
