import { upper } from 'alphabet'
import { clone, includes } from 'ramda'
import { validArrayIndex } from '../modules/arrayNumber.js'

export {
  sortArrayOfStringsAlphabetically,
  arrayContainsValue,
  valIsArray,
  arrayIsNotEmpty,
  mapEmptyArraysInArrayToOtherValue,
  reduceArrayValuesToOccurenceAmount,
  unwrapArrayValueAtIndex,
}

/**
 * Sorts arrays alphabetically, should only be used inside a sort Higher-Order function
 * @param {string} a first argument passed by array.sort to callback
 * @param {string} b second argument passed by array.sort to callback
 * @returns {boolean}
 */
function sortArrayOfStringsAlphabetically(a, b) {
  return upper.indexOf(a[0]) > upper.indexOf(b[0])
    ? 1
    : upper.indexOf(a[0]) === upper.indexOf(b[0])
    ? upper.indexOf(a[1]) > upper.indexOf(b[1])
      ? 1
      : -1
    : -1
}

/**
 * Check if a certain value exists in an array containing values of the same type
 * @param {Array} arr Array of any type
 * @returns {boolean}
 */
function arrayContainsValue(arr) {
  return val => includes(val, arr)
}

/**
 * Checks is value passed is an array
 * @param {*} val Value that's being checked
 * @returns {boolean}
 */
function valIsArray(val) {
  return Array.isArray(val)
}

/**
 * Filters empty arrays from an array containg arrays
 * @param {any[]} arr Array with arrays of which some are empty
 * @returns {boolean}
 */
function arrayIsNotEmpty(arr) {
  return !!arr.length
}

/**
 * Replace empty arrays inside an array to value passed
 * @param {*} val The value that will be replacing the empty arrays inside passed array
 * @returns {(Array) => (Array|*)} Function that returns array if array is not empty or parameter val if array is empty
 */
function mapEmptyArraysInArrayToOtherValue(val) {
  return arr => (arrayIsNotEmpty(arr) ? arr : val)
}

/**
 * A reducer function transforming an array into an array of tuples containing the amount of occurences for each unique value.
 * Example output: [['unique value', 5]] for ['unique value', 'unique value', 'unique value', 'unique value', 'unique value']
 * @param acc The accumulator, an OccurenceTuple
 * @param curr The current value being looped over
 * @returns {[*, number]} Array with occurrences for every unique value.
 */
function reduceArrayValuesToOccurenceAmount(acc, curr) {
  const i = acc.findIndex(tup => tup[0] === curr)
  // With a lot of thanks to Gufran Mirza @ https://ednsquare.com/story/immutable-update-patters-in-javascript-update-objects-and-arrays-------C2NqWN for this code
  return validArrayIndex(i)
    ? [...acc.slice(0, i), [curr, clone(acc[i][1]) + 1], ...acc.slice(i)]
    : [...acc, [curr, 1]]
}

function unwrapArrayValueAtIndex(i) {
  return array => array[i]
}
