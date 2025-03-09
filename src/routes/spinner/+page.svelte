<script>
  import { userData } from '../../lib/stores/store.js';
  import { onMount } from 'svelte';

  /**
   * @type {any[]}
   */
  let foodSuggestions = [];
  let isLoading = true;
  let spinDegree = 0;
  let isSpinning = false;
  let isBlurred = false;
  /**
   * @type {{ name: any; } | null}
   */
  let selectedFood = null;
  const minimumFoodItems = 9;

  async function fetchFoodData() {
    try {
      const response = await fetch('/data/foodDatabase.json');
      if (!response.ok) {
        throw new Error('Failed to fetch food data');
      }
      const foodDatabase = await response.json();

      // Validate and sanitize food data before using it
      if (Array.isArray(foodDatabase.foods)) {
        // Check for combination matches first (foods that match specific mood+weather combinations)
        // This assumes your food data has a combinationMatches array or similar structure
        // @ts-ignore
        let combinationMatches = foodDatabase.foods.filter((food) => {
          if (!food.combinationMatches) return false;
          
          // Check if this food has a match for current mood+weather combination
          // @ts-ignore
          return food.combinationMatches.some(combo => 
            combo.mood === $userData.mood && combo.weather === $userData.weather
          );
        });
        
        // If we have enough combination matches, use those
        if (combinationMatches.length >= minimumFoodItems) {
          foodSuggestions = combinationMatches.slice(0, minimumFoodItems);
        } 
        // Otherwise, try to find foods that match both mood AND weather separately
        else {
          // @ts-ignore
          let exactMatches = foodDatabase.foods.filter((food) =>
            food.moods?.includes($userData.mood) && food.weather?.includes($userData.weather)
          );
          
          // If we still don't have enough, add foods that match at least one criteria
          if ((combinationMatches.length + exactMatches.length) < minimumFoodItems) {
            // @ts-ignore
            let partialMatches = foodDatabase.foods.filter((food) =>
              food.moods?.includes($userData.mood) || food.weather?.includes($userData.weather)
            );
            
            // Remove duplicates (foods already in combinationMatches or exactMatches)
            const existingNames = [...combinationMatches, ...exactMatches].map(food => food.name);
            partialMatches = partialMatches.filter(
              // @ts-ignore
              (item) => !existingNames.includes(item.name)
            );
            
            // Combine all matches, prioritizing combination matches first, then exact matches, then partial
            foodSuggestions = [
              ...combinationMatches, 
              ...exactMatches, 
              ...partialMatches
            ].slice(0, minimumFoodItems);
          } else {
            // Just combinationMatches + exactMatches is enough
            foodSuggestions = [...combinationMatches, ...exactMatches].slice(0, minimumFoodItems);
          }
        }
      } else {
        console.warn('Invalid food data format');
        getEnhancedRandomFoodSuggestions(); // Fallback to random suggestions if data format is invalid
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
      getEnhancedRandomFoodSuggestions(); // Fallback to random suggestions on error
    } finally {
      isLoading = false;
      if (foodSuggestions.length < minimumFoodItems) {
        // If we still don't have enough suggestions, add some random ones
        getRandomFoodSuggestionsToFill(minimumFoodItems - foodSuggestions.length);
      }
    }
  }

  // @ts-ignore
  function getRandomFoodSuggestionsToFill(count) {
    fetch('/data/foodDatabase.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch random food data');
        }
        return response.json();
      })
      .then((foodDatabase) => {
        // Filter out foods already in our suggestions
        const existingNames = foodSuggestions.map(food => food.name);
        // @ts-ignore
        let availableFoods = foodDatabase.foods.filter(food => !existingNames.includes(food.name));
        
        // Shuffle and take what we need
        let additionalFoods = availableFoods
          .sort(() => Math.random() - 0.5)
          .slice(0, count);
        
        // If we don't have enough unique foods, add placeholders
        while (additionalFoods.length < count) {
          additionalFoods.push({ name: 'No Food Found' });
        }
        
        // Add these to our existing suggestions
        foodSuggestions = [...foodSuggestions, ...additionalFoods];
      })
      .catch((error) => {
        console.error("Error fetching random food data:", error);
        // Add placeholders if we can't get random foods
        // @ts-ignore
        const placeholders = Array(count).fill().map(() => ({ name: 'No Food Found' }));
        foodSuggestions = [...foodSuggestions, ...placeholders];
      });
  }

  function getEnhancedRandomFoodSuggestions() {
    fetch('/data/foodDatabase.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch random food data');
        }
        return response.json();
      })
      .then((foodDatabase) => {
        // Create different categories of food suggestions
        let categorizedSuggestions = [];
        
        // 1. Include some seasonal foods based on current month
        const currentMonth = new Date().getMonth();
        // @ts-ignore
        const seasonalFoods = foodDatabase.foods.filter(food => 
          food.seasonality && food.seasonality.includes(currentMonth)
        );
        if (seasonalFoods.length > 0) {
          categorizedSuggestions.push(...seasonalFoods.slice(0, 3));
        }
        
        // 2. Include some popular/trending foods
        // @ts-ignore
        const popularFoods = foodDatabase.foods.filter(food => food.popularity && food.popularity > 8);
        if (popularFoods.length > 0) {
          categorizedSuggestions.push(...popularFoods.sort(() => Math.random() - 0.5).slice(0, 2));
        }
        
        // 3. Include some comfort foods if user mood indicates they might need it
        if ($userData.mood && ['sad', 'stressed', 'tired', 'anxious'].includes($userData.mood.toLowerCase())) {
          // @ts-ignore
          const comfortFoods = foodDatabase.foods.filter(food => food.comfort && food.comfort > 7);
          if (comfortFoods.length > 0) {
            categorizedSuggestions.push(...comfortFoods.sort(() => Math.random() - 0.5).slice(0, 2));
          }
        }
        
        // 4. Include some completely random foods for variety
        let randomFoods = foodDatabase.foods
          // @ts-ignore
          .filter(food => !categorizedSuggestions.some(s => s.name === food.name))
          .sort(() => Math.random() - 0.5);
        
        // Fill the remaining slots with random foods
        const remainingSlots = minimumFoodItems - categorizedSuggestions.length;
        categorizedSuggestions.push(...randomFoods.slice(0, remainingSlots));
        
        // Ensure we have minimum number of food suggestions
        while (categorizedSuggestions.length < minimumFoodItems) {
          categorizedSuggestions.push({ name: 'Chef\'s Surprise' });
        }
        
        // Shuffle the final list to mix categories
        foodSuggestions = categorizedSuggestions.sort(() => Math.random() - 0.5);
      })
      .catch((error) => {
        console.error("Error fetching random food data:", error);
        // Fill with placeholders on error
        // @ts-ignore
        foodSuggestions = Array(minimumFoodItems).fill().map(() => ({ 
          name: 'No Food Found'
        }));
      });
  }

  // Replace the old getRandomFoodSuggestions function with this enhanced version
  // @ts-ignore
  function getRandomFoodSuggestions() {
    getEnhancedRandomFoodSuggestions();
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

  // Add reactive statement to update food suggestions when user preferences change
  // @ts-ignore
 // @ts-ignore
   $: if ($userData.mood && $userData.weather) {
    fetchFoodData();
  }

  onMount(() => {
    if ($userData.mood && $userData.weather) {
      fetchFoodData();
    } else {
      // If no user preferences are set yet, show random suggestions
      getEnhancedRandomFoodSuggestions();
    }
  });
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8B195] to-[#F67280] p-6">
  <div class="w-full max-w-lg bg-white bg-opacity-95 rounded-lg shadow-lg p-6 text-center">
    
    <h1 class="text-2xl font-extrabold text-[#2E4057] mb-4">Your Preferences</h1>

    {#if $userData.mood}
      <p class="text-lg text-[#2E4057] leading-relaxed">
        You are currently in <strong>{$userData.place}</strong> with <strong>{$userData.weather}</strong> weather,  
        feeling <strong class="text-[#F67280]">{$userData.mood}</strong>.
      </p>
    {/if}

    <h2 class="text-xl font-bold text-[#F67280] mt-6 mb-4">Recommended Foods</h2>

    {#if isLoading}
      <p class="text-lg text-[#2E4057]">Finding the best food options for you...</p>
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

        <div class="mt-6 flex flex-col md:flex-row justify-center gap-4 w-full">
          <button 
            on:click={() => { spinWheel(); resetBlur(); }} 
            class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#F67280] text-white rounded-lg hover:bg-[#E56270] transition-all">
            🎰 Spin
          </button>
          
          <button 
            on:click={() => { getEnhancedRandomFoodSuggestions(); resetBlur(); }} 
            class="w-full md:w-36 px-4 py-2 text-md md:text-lg font-bold bg-[#6C5B7B] text-white rounded-lg hover:bg-[#5D4C6C] transition-all">
            🔀 Shuffle
          </button>
        </div>        
      </div>
    {:else}
      <p class="mt-4 text-lg text-[#F67280]">No food matches your preferences. Try shuffling!</p>
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
  border: 2px solid #FF6347; /* Warm, subtle color */
  position: relative;
  overflow: hidden;
  transform-origin: center center;
  transition: transform 2s ease-out, box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
  background: linear-gradient(135deg, #FFB6C1, #FFD700); /* Soft pastel pink to a light candy yellow */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.roulette-wheel:hover {
  transform: scale(1.05); /* Slight zoom on hover */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow on hover */
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
    filter: blur(2px);
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
    color: #2E4057;
  }

  .roulette-item.highlighted span {
    color: #F67280;
    font-weight: 900;
  }

  .selected-food {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    font-weight: bold;
    color: #2E4057;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
</style>