<script>
  import { userData } from '../../lib/stores/store.js'; // Import the store
  import { onMount } from 'svelte';

  /** 
   * @type {Array<{ id: number, name: string, moods: string[], weather: string[] }> }
   */
  let foodSuggestions = [];
  let isLoading = true; // State to track loading
  let spinDegree = 0; // Track the spin degree of the wheel
  let isSpinning = false; // To prevent continuous spinning on button click
  /**
	 * @type {{ name: any; id?: number; moods?: string[]; weather?: string[]; } | null}
	 */
  let selectedFood = null; // Track the food that is chosen by the roulette
  const minimumFoodItems = 9;

  /**
   * Fetches food data and filters it based on mood and weather
   * @returns {Promise<void>}
   */
  async function fetchFoodData() {
    try {
      const response = await fetch('/data/foodDatabase.json');
      const foodDatabase = await response.json();
      foodSuggestions = foodDatabase.foods.filter((/** @type {{ moods: string | string[]; weather: string | string[]; }} */ food) =>
        food.moods.includes($userData.mood) && food.weather.includes($userData.weather)
      );
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      isLoading = false; // Set loading state to false once data is fetched

      // Fill the array with blank food entries if there are fewer than 9 suggestions
      if (foodSuggestions.length < minimumFoodItems) {
        const blankSlots = minimumFoodItems - foodSuggestions.length;
        for (let i = 0; i < blankSlots; i++) {
          foodSuggestions.push({ name: 'Empty Slot' }); // Use a placeholder for empty slots
        }
      }
    }
  }

  // Function to spin the roulette wheel
  function spinWheel() {
    if (isSpinning) return; // Prevent spinning if already in progress
    isSpinning = true;

    // Add random rotation to simulate the spin
    const rotation = Math.floor(Math.random() * 1000) + 1000;
    spinDegree += rotation;

    // Calculate the "winning" food based on the final position of the wheel
    const winningIndex = Math.floor((spinDegree % 360) / (360 / foodSuggestions.length));
    selectedFood = foodSuggestions[winningIndex];

    // Reset spinning after animation duration
    setTimeout(() => {
      isSpinning = false;
    }, 2000); // 2s duration for the animation
  }

  // Fetch food data when the component mounts
  onMount(() => {
    fetchFoodData();
  });
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
    <!-- Flex Container to Center Everything -->
    <div class="roulette-wrapper">
      <!-- Roulette Wheel Container -->
      <div class="roulette-container">
        <!-- Arrow at the top of the wheel, outside the rotation -->
        <div class="roulette-arrow"></div>

        <!-- Roulette Wheel Component -->
        <div class="roulette-wheel" style="transform: rotate({spinDegree}deg)">
          <div class="roulette-items">
            {#each foodSuggestions as food, i}
              <div
                class="roulette-item"
                style="transform: rotate({(360 / foodSuggestions.length) * i}deg) translateY(-50%)"
              >
                <span>{food.name}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Spin Button -->
      <button on:click={spinWheel} class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Spin the Wheel!
      </button>
    </div>

    {#if selectedFood}
      <p class="mt-4 text-lg font-bold">
        The chosen food is: <span class="text-blue-500">{selectedFood.name}</span>
      </p>
    {/if}

  {:else}
    <p class="mt-4 text-lg text-red-500">No food suggestions found for your mood and weather.</p>
  {/if}
</div>

<style>
  /* Wrapper to Center All Elements */
  .roulette-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px; /* Add space between the wheel and button */
    text-align: center;
  }

  .roulette-container {
    position: relative;
    display: inline-block;
  }

  .roulette-arrow {
  position: absolute;
  /* top: 0px; Adjust position as needed */
  left: 50%;
  transform: translateX(-50%) rotate(360deg); /* Rotate the arrow 180 degrees */
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid black; /* Change from border-bottom to border-top */
}


  .roulette-wheel {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 2px solid #000;
    position: relative;
    overflow: hidden;
    transform-origin: center center;
    transition: transform 2s ease-out;
    margin: 0 auto;
  }

  .roulette-items {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .roulette-item {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    font-size: 16px;
    line-height: 1.2;
    transform-origin: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .roulette-item span {
    display: block;
    font-weight: bold;
    text-transform: uppercase;
    position: absolute;
    left: 50%;
    top: 0;  /* Reset vertical position */
    transform: translateX(-50%) translateY(-100px) rotate(90deg);  /* Center text within the wheel */
  }

  .roulette-wheel .roulette-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
