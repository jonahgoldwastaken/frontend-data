export {
  splitStringOnRegex,
  splitStringOnString,
  replaceStringThroughRegex,
  mapCapitaliseString,
  stringEqualsString,
  stringMatchesRegEx,
  stringIsNumber,
  filterStringLength,
  filterStringIsNaN,
  filterStringIncludedInArray,
  replaceStringForObjectValue,
  stringContainsString,
  removeStringFromString,
  removeRegExFromString,
}

/**
 * Splits string on parts that match provided RegEx
 *
 * @param {RegExp} regex RegEx to split string on
 * @returns {(string) => string[]} Function that takes a string and splits it on provided RegExp
 */
function splitStringOnRegex(regex) {
  return str => str.slice().split(regex)
}

/**
 * Splits string on the value of provided split string
 *
 * @param {string} splitStr String containing value to split string on
 * @returns {(string) => string[]} Function that takes a string and splits it on provided string
 */
function splitStringOnString(splitStr) {
  return str => str.slice().split(splitStr)
}

/**
 * Replaces certain parts of string where provided RegEx matches with provided replacement value
 *
 * @param {RegExp} regex RegEx to test on
 * @param {string} replacementVal Value replacing matching parts of string
 * @returns {(string) => string} Function that replaces string on regex with replacementVal
 */
function replaceStringThroughRegex(regex, replacementVal) {
  return str => str.slice().replace(regex, replacementVal)
}

/**
 * Capitalises first character of string
 *
 * @param {string} str String to capitalise
 * @returns {string} Uppercased string
 */
function mapCapitaliseString(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`
}

/**
 * Checks if string equals provided filterString
 *
 * @param {string} filterStr String to filter string on
 * @returns {(string) => boolean} Function that checks provided string
 */
function stringEqualsString(filterStr) {
  return str => !(str.slice().toLowerCase() === filterStr.slice().toLowerCase())
}

/**
 * Checks if string matches provided RegEx
 *
 * @param {RegExp} filterRegex RegExp to match string on
 * @returns {(string) => boolean} Filter that checks if it matches regex
 */
function stringMatchesRegEx(filterRegex) {
  return str => !str.slice().toLowerCase().match(filterRegex)
}

/**
 * Check if string is a number
 *
 * @param {string} str String to check
 * @returns {boolean}
 */
function stringIsNumber(str) {
  return !Number.isNaN(Number(str))
}

/**
 * Checks if string is not an empty string
 *
 * @param {string} str String to check
 * @returns {boolean}
 */
function filterStringLength(str) {
  return !!str.length
}

/**
 * Checks if provided string is not a number
 *
 * @param {string} str String to check
 * @returns {boolean}
 */
function filterStringIsNaN(str) {
  return Number.isNaN(Number(str))
}

/**
 * Returns a function that checks if provided string is included in array provided
 *
 * @param {string[]} arr Array to map over
 * @returns {(string) => boolean}
 */
function filterStringIncludedInArray(arr) {
  return str =>
    [...arr].map(val => val.toLowerCase()).includes(str.toLowerCase())
}

/**
 * Replaces string to object value based on if the string is a key inside the object
 *
 * @param {object} obj Look-up table containing key-pair values resembling old and new string values
 * @returns {(string) => (*|string)}
 */
function replaceStringForObjectValue(obj) {
  return str => obj[str] ?? str
}

/**
 * Checks if provided string includes the compareStr provided
 *
 * @param compareStr String to compare string in curried function to
 * @returns {(string) => boolean}
 */
function stringContainsString(compareStr) {
  return str => str.includes(compareStr)
}

/**
 * Removed strPartial from string
 *
 * @param {string} strPartial String that needs to be removed from full string
 * @returns {(string) => string}
 */
function removeStringFromString(strPartial) {
  return str => str.replace(strPartial, '')
}

/**
 * Removes everything from string that matches regular expression
 *
 * @param {RegExp} regex Regular exprssion that will be removed from full string
 * @returns {(string) => string}
 */
function removeRegExFromString(regex) {
  return str => str.replace(regex, '')
}
