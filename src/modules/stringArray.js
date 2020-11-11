import { filter, map, pipe, toLower } from 'ramda'
import { arrayContainsValue } from '../utilities/array.js'
import { filterStringIncludedInArray } from '../utilities/strings.js'
import { filterValidStrings } from './strings.js'

export {
  filterValidStringsWithFunc,
  filterValidStringsWithArr,
  arrayValueContainsString,
}

/**
 * Filters strings on validity and pushes valid strings in other filter func
 *
 * @param {(string) => boolean} func Filter function for string
 * @returns {string[]} Filtered string array
 */
function filterValidStringsWithFunc(func) {
  return pipe(filter(filterValidStrings), filter(func))
}

/**
 * Prepares filter function that filters on strings in validArr
 *
 * @param {string[]} validArr Array with valid string
 * @returns {(string[]) => string[]} Function that filters string on validity from passed validArr
 */
function filterValidStringsWithArr(validArr) {
  return pipe(
    filter(filterValidStrings),
    filter(filterStringIncludedInArray(validArr))
  )
}

/**
 * Check if Array contains provided string value
 * @param {string[]} arr Array of strings
 * @returns {(string) => boolean}
 */
function arrayValueContainsString(arr) {
  return pipe(toLower, pipe(map(toLower), arrayContainsValue)(arr))
}
