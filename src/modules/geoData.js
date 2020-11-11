import {
  pipe,
  map,
  ifElse,
  tail,
  zipObj,
  reduce,
  equals,
  gt,
  length,
  add,
} from 'ramda'
import { divideNum } from 'ramda-adjunct'
import {
  splitStringOnString,
  removeRegExFromString,
} from '../utilities/strings.js'
import { isGeoDataPoint } from '../utilities/geoData.js'

export { parseGeoData }

/**
 * Parses GeoData string to coordinates object
 *
 * @param {string} geoData  GeoData to parse
 * @returns {object} parsed object as {long: number, lat: number}
 */
function parseGeoData(geoData) {
  return pipe(
    splitStringOnString(' '),
    map(
      pipe(
        removeRegExFromString(/\(/g),
        removeRegExFromString(/\)/g),
        removeRegExFromString(/,/g)
      )
    ),
    ifElse(isGeoDataPoint, parseGeoPoint, parseGeoPolygon)
  )(geoData)
}

function parseGeoPoint(pointData) {
  return pipe(tail, map(Number), zipObj(['lat', 'long']))(pointData)
}

function parseGeoPolygon(polygonData) {
  return pipe(
    tail,
    map(Number),
    reduce(
      ([lat, long], curr) => [
        equals(lat.length, long.length) ? [...lat, curr] : [...lat],
        gt(lat.length, long.length) ? [...long, curr] : [...long],
      ],
      [[], []]
    ),
    map(val => divideNum(length(val), reduce(add, 0, val))),
    zipObj(['long', 'lat'])
  )(polygonData)
}
