import { greaterThan } from '../utilities/number.js'

export { validArrayIndex }

/**
 * Checks if passed index is a valid array index
 * @param {number} i Index to check
 */
function validArrayIndex(i) {
  return greaterThan(-1)(i)
}
