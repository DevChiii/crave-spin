// src/stores.js
import { writable } from 'svelte/store';

// Creating a writable store for the user selections
export const userData = writable({
  mood: '',
  country: '',
  weather: ''
});
