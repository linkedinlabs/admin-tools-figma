import { readable, writable } from 'svelte/store';

// writeable
export const isStyles = writable(false);
export const currentFilter = writable(null);
export const openItems = writable([]);
export const lockedItems = writable([]);
export const sessionKey = writable(null);

// static
const libraryOptionsArray = [
  {
    value: 'unassigned',
    text: 'Not assigned',
    disabled: false,
  },
  {
    value: 'art-deco',
    text: 'Art Deco',
    disabled: false,
  },
  {
    value: 'mercado',
    text: 'Mercado',
    disabled: false,
  },
];
export const libraryOptions = readable(libraryOptionsArray);
