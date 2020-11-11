import fetch from 'node-fetch'

export { fetchData, parseResToJson }

/**
 * Fetches data from passed URL
 *
 * @param url URL to fetch data from
 * @returns {Promise}
 */
function fetchData(url) {
  return fetch(url)
}

/**
 * Parses JSON string into a JavaScript value
 *
 * @param res response object to parse as a JSON string
 * @returns {Promise}
 */
function parseResToJson(res) {
  return res.json()
}
