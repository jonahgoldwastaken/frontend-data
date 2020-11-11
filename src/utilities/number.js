export { greaterThan }

/**
 * Returns a function that checks if value passed into it is greater than the value passed into this function
 *
 * @param {number} a
 * @returns {(number) => boolean} Function to hold number a against number provided to function
 */
function greaterThan(a) {
  return b => a < b
}
