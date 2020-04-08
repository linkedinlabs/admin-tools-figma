/**
 * @description Takes the existing `names` dictionary from the `unique-names-generator` package
 * and expands it with a deconstructed version of the package’s `starWars` dictionary, and
 * adds additional custom names.
 * [names Source]{@link https://raw.githubusercontent.com/andreasonny83/unique-names-generator/master/src/dictionaries/names.ts}
 * [starWars Source]{@link https://raw.githubusercontent.com/andreasonny83/unique-names-generator/master/src/dictionaries/star-wars.ts}
 *
 * @kind constant
 * @name names
 * @type {Array}
 */
const Generator = require('unique-names-generator');

const { names, starWars } = Generator;

const starWarsSplit = [];
starWars.forEach((characterName) => {
  const splitNames = characterName.split(/(?=\s[A-Z])/);
  splitNames.forEach(splitName => starWarsSplit.push(splitName.trim()));
});

export default [
  ...names,
  ...starWarsSplit,
  'Grant',
  'Greg',
  'Gregory',
  'Nate',
  'Nathan',
];
