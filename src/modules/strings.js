export { filterValidStrings }

/**
 * Checks if provided string is valid
 * @param {string} str String to check
 * @returns {boolean}
 */
function filterValidStrings(str) {
  return str.length && Number.isNaN(Number(str)) ? true : false
}
