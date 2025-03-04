<!-- src/routes/roulette/+page.svelte -->
<script>
  import { userData } from '../../stores/store'; // Import the store
</script>

<div class="p-6 text-center">
  <h1 class="text-2xl font-bold mb-4">Your Selections</h1>

  {#if $userData.mood} <!-- Use $userData to automatically subscribe to the store -->
    <p class="mt-4 text-lg">
      You are in <strong>{$userData.country}</strong>, the weather is <strong>{$userData.weather}</strong>,
      and you are feeling <strong class="text-blue-500">{$userData.mood}</strong>.
    </p>
  {/if}
</div>
