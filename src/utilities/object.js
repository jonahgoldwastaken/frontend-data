import { assoc, keys, reduce } from 'ramda'

export { pickKeyFromObject, renameObjectKeys }

/**
 * Returns only the value from passed key in provided object
 *
 * @param {string} key Key to return from object
 * @returns {(object) => *} Function that takes an object and returns value at provided key
 */
function pickKeyFromObject(key) {
  return object => ({ ...object }[key])
}

/**
 * Changes the keys inside provided object to values of newKeysObj
 *
 * @param {object} keyMap Lookup table containing old keys as keys and new keys as values
 * @return {(object) => object} Function that transforms provided object using provided keyMap
 */
function renameObjectKeys(keysMap) {
  return obj =>
    reduce(
      (acc, key) => assoc(keysMap[key] || key, obj[key], acc),
      {}
    )(keys(obj))
}
