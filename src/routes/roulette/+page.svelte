<script>
  import { userData } from '../../lib/stores/store.js'; // Import the store
  import { onMount } from 'svelte';

  // @ts-ignore
  /**
	 * @type {any[]}
	 */
  let foodSuggestions = [];
  let isLoading = true;
  let spinDegree = 0;
  let isSpinning = false;
  let isBlurred = false;
  // @ts-ignore
  /**
	 * @type {{ name: any; } | null}
	 */
  let selectedFood = null;
  const minimumFoodItems = 9;

  async function fetchFoodData() {
    try {
      const response = await fetch('/data/foodDatabase.json');
      const foodDatabase = await response.json();
      // @ts-ignore
      foodSuggestions = foodDatabase.foods.filter((food) =>
        food.moods.includes($userData.mood) && food.weather.includes($userData.weather)
      );
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      isLoading = false;
      if (foodSuggestions.length < minimumFoodItems) {
        const blankSlots = minimumFoodItems - foodSuggestions.length;
        for (let i = 0; i < blankSlots; i++) {
          foodSuggestions.push({ name: 'Empty Slot' });
        }
      }
    }
  }

  function getRandomFoodSuggestions() {
    fetch('/data/foodDatabase.json')
      .then((response) => response.json())
      .then((foodDatabase) => {
        let shuffledFoodSuggestions = foodDatabase.foods.sort(() => Math.random() - 0.5);
        while (shuffledFoodSuggestions.length < minimumFoodItems) {
          shuffledFoodSuggestions.push({ name: 'Empty Slot' });
        }
        shuffledFoodSuggestions = shuffledFoodSuggestions.slice(0, minimumFoodItems);
        foodSuggestions = [...shuffledFoodSuggestions];
      })
      .catch((error) => {
        console.error("Error fetching random food data:", error);
      });
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    const rotation = Math.floor(Math.random() * 1000) + 1000;
    spinDegree += rotation;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * foodSuggestions.length);
      // @ts-ignore
      selectedFood = foodSuggestions[randomIndex];
      isSpinning = false;

      // @ts-ignore
      foodSuggestions = foodSuggestions.map((food, index) => ({
        ...food,
        isHighlighted: index === randomIndex,
      }));

      isBlurred = true;
    }, 2000);
  }

  function resetBlur() {
    selectedFood = null;
    isBlurred = false;
  }

  onMount(() => {
    fetchFoodData();
  });
</script>

<div class="p-6 bg-gradient-to-br from-[#FF6347] to-[#FFD700] min-h-screen flex flex-col items-center justify-center">
  <div class="w-full max-w-xl text-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-4 text-[#333333]">Your Selections</h1>

    {#if $userData.mood}
      <p class="mt-4 text-lg text-[#333333]">
        You are in <strong>{$userData.place}</strong>, the weather is <strong>{$userData.weather}</strong>,
        and you are feeling <strong class="text-[#FF6347]">{$userData.mood}</strong>.
      </p>
    {/if}

    <h2 class="text-xl font-semibold mt-6 mb-4 text-[#FF6347]">Food Suggestions</h2>

    {#if isLoading}
      <p class="mt-4 text-lg text-[#333333]">Loading food suggestions...</p>
    {:else if foodSuggestions.length > 0}
      <div class="roulette-wrapper">
        <div class="roulette-container">
          <div class="roulette-wheel" style="transform: rotate({spinDegree}deg)">
            <div class="roulette-items {isBlurred ? 'blurred' : ''}">
              {#each foodSuggestions as food, i}
                <div
                  class="roulette-item {food.isHighlighted ? 'highlighted' : ''}"
                  style="transform: rotate({(360 / foodSuggestions.length) * i}deg) translateY(-50%)"
                >
                  <span>{food.name}</span>
                </div>
              {/each}
            </div>
          </div>

          {#if selectedFood}
            <div class="selected-food">
              <span>{selectedFood.name}</span>
            </div>
          {/if}
        </div>

        <div class="mt-4 flex justify-center gap-4">
          <button on:click={() => { spinWheel(); resetBlur(); }} class="px-4 py-2 bg-[#FF6347] text-white rounded-lg hover:bg-[#E25438] transition-colors">
            Spin the Wheel!
          </button>
          <button on:click={() => { getRandomFoodSuggestions(); resetBlur(); }} class="px-4 py-2 bg-[#98FF98] text-[#333333] rounded-lg hover:bg-[#89EE89] transition-colors">
            Change Suggestions
          </button>
        </div>
      </div>
    {:else}
      <p class="mt-4 text-lg text-[#FF6347]">No food suggestions found for your mood and weather.</p>
    {/if}
  </div>
</div>

<style>
  .roulette-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
    position: relative;
  }

  .roulette-container {
    position: relative;
    display: inline-block;
  }

  .roulette-wheel {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 2px solid #333;
    position: relative;
    overflow: hidden;
    transform-origin: center center;
    transition: transform 2s ease-out;
    margin: 0 auto;
    background-color: #f8f8f8;
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
    transition: filter 0.5s ease-in-out;
  }

  .roulette-items.blurred {
    filter: blur(4px);
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
    top: 0;
    transform: translateX(-50%) translateY(-100px) rotate(90deg);
    font-size: 12px;
    max-width: 80px;
    white-space: nowrap;
  }

  .roulette-item.highlighted span {
    color: #FF6347;
  }

  .selected-food {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 8px 12px;
    border-radius: 4px;
  }

  .selected-food span {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }

  button {
    transition: all 0.2s ease;
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    transform: translateY(1px);
  }
</style>
