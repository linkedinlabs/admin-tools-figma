import { readable, writable } from 'svelte/store';

// writeable
export const isSelection = writable(true);
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

const libraryStatusOptionsArray = [
  {
    value: 'alpha',
    text: 'Alpha (pre-release)',
    disabled: false,
  },
  {
    value: 'beta',
    text: 'Beta',
    disabled: false,
  },
  {
    value: 'production',
    text: 'Production',
    disabled: false,
  },
  {
    value: 'planned-deprecation',
    text: 'Deprecation Planned',
    disabled: false,
  },
  {
    value: 'deprecated',
    text: 'Deprecated',
    disabled: false,
  },
];
export const libraryStatusOptions = readable(libraryStatusOptionsArray);

// static
const keystopKeysInitOptionsArray = [
  {
    value: 'no-key',
    text: 'Add key…',
    disabled: true,
  },
  {
    value: 'divider--01',
    text: null,
    disabled: true,
  },
  {
    value: 'arrows-left-right',
    text: 'Arrow keys (left/right)',
    disabled: false,
  },
  {
    value: 'arrows-up-down',
    text: 'Arrow keys (up/down)',
    disabled: false,
  },
  {
    value: 'enter',
    text: 'Enter',
    disabled: false,
  },
  {
    value: 'divider--02',
    text: null,
    disabled: true,
  },
  {
    value: 'space',
    text: 'Space',
    disabled: false,
  },
  {
    value: 'divider--03',
    text: null,
    disabled: true,
  },
  {
    value: 'escape',
    text: 'Escape',
    disabled: false,
  },
];
export const keystopKeysInitOptions = readable(keystopKeysInitOptionsArray);

const keystopKeysOptionsArray = [
  {
    value: 'no-key',
    text: 'No key (remove)',
    disabled: false,
  },
  {
    value: 'divider--01',
    text: null,
    disabled: true,
  },
  {
    value: 'arrows-left-right',
    text: 'Arrow keys (left/right)',
    disabled: false,
  },
  {
    value: 'arrows-up-down',
    text: 'Arrow keys (up/down)',
    disabled: false,
  },
  {
    value: 'enter',
    text: 'Enter',
    disabled: false,
  },
  {
    value: 'divider--02',
    text: null,
    disabled: true,
  },
  {
    value: 'space',
    text: 'Space',
    disabled: false,
  },
  {
    value: 'divider--03',
    text: null,
    disabled: true,
  },
  {
    value: 'escape',
    text: 'Escape',
    disabled: false,
  },
];
export const keystopKeysOptions = readable(keystopKeysOptionsArray);

const roleOptionsArray = [
  {
    value: 'none',
    text: 'No role',
    disabled: false,
  },
  {
    value: 'button',
    text: 'Button',
    disabled: false,
  },
  {
    value: 'checkbox',
    text: 'Checkbox',
    disabled: false,
  },
  {
    value: 'link',
    text: 'Link',
    disabled: false,
  },
  {
    value: 'option',
    text: 'Option',
    disabled: false,
  },
  {
    value: 'radio',
    text: 'Radio',
    disabled: false,
  },
  {
    value: 'slider',
    text: 'Slider',
    disabled: false,
  },
  {
    value: 'switch',
    text: 'Switch',
    disabled: false,
  },
  {
    value: 'tab',
    text: 'Tab',
    disabled: false,
  },
  {
    value: 'other',
    text: 'Other',
    disabled: false,
  },
];
export const roleOptions = readable(roleOptionsArray);
