import { writable } from 'svelte/store';

export const isStyles = writable(false);
export const openItems = writable([]);
export const lockedItems = writable([]);
