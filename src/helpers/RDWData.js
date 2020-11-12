import {
  assoc,
  propEq,
  filter,
  map,
  pipe,
  find,
  pick,
  ifElse,
  isNil,
  always,
  values,
  omit,
} from 'ramda'
import { renameKeys } from 'ramda-adjunct'
import { parseGeoData } from '../modules/geoData.js'
import { unwrapSingleItemArray } from '../modules/array.js'

export { parkingAreaMapper }

const parkingAreaLookupTable = {
  areaid: 'id',
  areadesc: 'description',
}

/**
 * Maps the data over parking areas, adding data from other datasets in the process.
 *
 * @param {object[][]} data Array with data object arrays.
 * @returns {object[]} Parsed parking areas.
 */
function parkingAreaMapper(data) {
  return pipe(
    map(val =>
      pipe(
        renameKeys(parkingAreaLookupTable),
        omit(['startdatearea', 'enddatearea', 'usageid', 'areamanagerid']),
        assoc('usage', associateUsageGoal(data[1], val)),
        assoc('capacity', associateSpecifications(data[2], val)),
        assoc('coordinates', associateCoordinates(data[3], val)),
        assoc('openingHours', associateParkingEntrance(data[4], val))
      )(val)
    ),
    map(mapAddOpeningHoursAsKeyToArea),
    filter(filterInvalidCoordinates)
  )(data[0])
}

/**
 * Filter function that checks for valid coordinates on area object.
 *
 * @param {object} area Parking area that is being filtered.
 * @returns {boolean} Based on if the coordinates are valid.
 */
function filterInvalidCoordinates(area) {
  return area.coordinates.long != Infinity
}

/**
 * Finds usage goal of parking area to associate to its object.
 *
 * @param {object[]} goals Array with usage goal object.
 * @param {object} area Parking area object.
 * @returns {string} Usage goal description or string stating there is no usage goal found.
 */
function associateUsageGoal(goals, area) {
  return pipe(
    find(propEq('usageid', area.usageid)),
    ifElse(
      isNil,
      always('Heeft geen gebruiksdoel'),
      pipe(pick(['usageiddesc']), values, unwrapSingleItemArray)
    )
  )(goals)
}

/**
 * Finds area specifications of parking area to associate the capacity area object.
 *
 * @param {object[]} specs Array with area specification objects.
 * @param {object} area Parking area object.
 * @returns {number} The found capacity, or 0 of none is found
 */
function associateSpecifications(specs, area) {
  return pipe(
    find(propEq('areaid', area.areaid)),
    ifElse(isNil, always(0), pick(['capacity']), unwrapSingleItemArray, Number)
  )(specs)
}

/**
 * Finds geo data of parking area to associate to its object.
 *
 * @param {object[]} geoData Array with geo data objects.
 * @param {object} area Parkign area object.
 * @return {object} Coordinates, or coordinates object with Infinity values
 */
function associateCoordinates(geoData, area) {
  return pipe(
    find(propEq('areaid', area.areaid)),
    ifElse(
      isNil,
      always({ long: Infinity, lat: Infinity }),
      pipe(
        pick(['areageometryastext']),
        values,
        unwrapSingleItemArray,
        parseGeoData
      )
    )
  )(geoData)
}

/**
 * Finds opening times of parking area to associate to its object.
 *
 * @param {object[]} entrance Array with parking entrance objects.
 * @param {object} area Parking area object.
 * @returns {number[]} Two-lengthed array with opening and closing time
 */
function associateParkingEntrance(entrance, area) {
  return pipe(
    find(propEq('areaid', area.areaid)),
    ifElse(
      isNil,
      always([null, null]),
      pipe(pick(['enterfrom', 'enteruntil']), map(Object.values))
    )
  )(entrance)
}

/**
 * Tries to find opening hours from parking area description, and associates it to openingHours key.
 *
 * @param {object} area Parking area object.
 * @returns {object} Parking area object with parsed or unparsed openingHours.
 */
function mapAddOpeningHoursAsKeyToArea(area) {
  return area.openingHours[0]
    ? area
    : 'description' in area
    ? area.description.match(/\d+-\d+/)
      ? {
          ...area,
          openingHours: [
            area.description.match(/\d+-\d+/)[0].split('-')[0],
            area.description.match(/\d+-\d+/)[0].split('-')[1],
          ],
        }
      : {
          ...area,
          openingHours: [null, null],
        }
    : area
}
