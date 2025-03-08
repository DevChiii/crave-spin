<script>
  import { userData } from '../../lib/stores/store.js';
  import { onMount } from 'svelte';

  let foodSuggestions = [];
  let isLoading = true;
  let spinDegree = 0;
  let isSpinning = false;
  let isBlurred = false;
  let selectedFood = null;
  const minimumFoodItems = 9;

  async function fetchFoodData() {
    try {
      const response = await fetch('/data/foodDatabase.json');
      const foodDatabase = await response.json();
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
          foodSuggestions.push({ name: 'No Food Found' });
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
          shuffledFoodSuggestions.push({ name: 'No Food Found' });
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
      selectedFood = foodSuggestions[randomIndex];
      isSpinning = false;

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

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FF6347] to-[#FFD700] p-6">
  <div class="w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-lg p-6 text-center">
    
    <h1 class="text-2xl font-extrabold text-[#333333] mb-4">Your Preferences</h1>

    {#if $userData.mood}
      <p class="text-lg text-[#333333] leading-relaxed">
        You are currently in <strong>{$userData.place}</strong> with <strong>{$userData.weather}</strong> weather,  
        feeling <strong class="text-[#FF6347]">{$userData.mood}</strong>.
      </p>
    {/if}

    <h2 class="text-xl font-bold text-[#FF6347] mt-6 mb-4">Recommended Foods</h2>

    {#if isLoading}
      <p class="text-lg text-[#333333]">Finding the best food options for you...</p>
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

        <!-- ✅ Improved Button Labels & Consistent Sizes -->
        <div class="mt-6 flex flex-col md:flex-row justify-center gap-4 w-full">
          <button 
            on:click={() => { spinWheel(); resetBlur(); }} 
            class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#FF6347] text-white rounded-lg hover:bg-[#E25438] transition-all">
            🎰 Spin
          </button>
          
          <button 
            on:click={() => { getRandomFoodSuggestions(); resetBlur(); }} 
            class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#98FF98] text-[#333333] rounded-lg hover:bg-[#89EE89] transition-all">
            🔀 Shuffle
          </button>
        </div>        
      </div>
    {:else}
      <p class="mt-4 text-lg text-[#FF6347]">No food matches your preferences. Try shuffling!</p>
    {/if}
  </div>
</div>

<style>
  .roulette-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
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
    transform-origin: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .roulette-item span {
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
    background-color: rgba(255, 255, 255, 0.8);
    padding: 8px 12px;
    border-radius: 4px;
  }
</style>
