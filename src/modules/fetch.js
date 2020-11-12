import { andThen, map, otherwise, pipe } from 'ramda'
import { fetchData, parseResToJson } from '../utilities/fetch.js'

export { fetchAndParseJson, fetchAndParseMultipleJson }

/**
 * Fetches and parses fetched data as JSON string
 * @param {string} url URL to fetch data from
 * @returns {Prormise}
 */
function fetchAndParseJson(url) {
  return pipe(fetchData, otherwise(console.log), andThen(parseResToJson))(url)
}

/**
 * Fetches data from passed array of URI
 * @param {string[]} uri Array of URI to fetch data from
 * @returns {Promise}
 */
function fetchAndParseMultipleJson(uri) {
  return pipe(map(fetchAndParseJson), Promise.all.bind(Promise))(uri)
}
