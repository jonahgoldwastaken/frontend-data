import { unwrapArrayValueAtIndex } from '../utilities/array.js'

export { unwrapSingleItemArray }

/**
 * Unwraps item at index 0 from array
 * @param {array} arr Array to unwrap value from
 * @returns Item at index 0
 */
function unwrapSingleItemArray(arr) {
  return unwrapArrayValueAtIndex(0)(arr)
}
