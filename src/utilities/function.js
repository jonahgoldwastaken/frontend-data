import { always, F, ifElse } from 'ramda'

export { runFuncIfTrue }

/**
 * Runs a function if the provided statement is true/truthy
 *
 * @param bool Boolean derived from any statement that can be coerced into a boolean
 * @returns {(() => *) => (boolean|*)}
 */
function runFuncIfTrue(bool) {
  return func => ifElse(always(bool), func, F)
}
