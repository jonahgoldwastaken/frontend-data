import { filter, isEmpty, pipe } from 'ramda'
import { getType } from '../utilities/type.js'

export { filterInvalidStringOccurenceTuples }

/**
 * Filters OccurenceTuples that should contain strings on if they have valid values and amounts.
 * @param {[*, number][]} tups Array of OccurenceTuples that should contain strings
 * @returns {[*, number][]}
 */
function filterInvalidStringOccurenceTuples(tups) {
  return pipe(
    filter(occurenceTupleValueIsValidString),
    filter(stringOccurenceTupleAmountIsValid)
  )(tups)
}

/**
 * Checks if the amount value in an OccurenceTuple is valid
 * @param {[*, number]} tup OccurenceTuple to check
 * @returns {[*, number]}
 */
function stringOccurenceTupleAmountIsValid(tup) {
  return !Number.isNaN(tup[1])
}

/**
 * Checks if OccurenceTuple that should contian a string has a valid string
 * @param {[*, number]} tup OccurenceTuple to check
 * @returns {[*, number]}
 */
function occurenceTupleValueIsValidString(tup) {
  return getType(tup[0]) === 'string' && !isEmpty(tup[0])
}
