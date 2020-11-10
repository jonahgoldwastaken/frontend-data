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
import { unwrapArrayValueAtIndex } from '../utilities/array.js'

export { parkingAreaMapper }

const parkingAreaLookupTable = {
  areaid: 'id',
  areadesc: 'description',
}

function parkingAreaMapper(data) {
  return pipe(
    map(val =>
      pipe(
        renameKeys(parkingAreaLookupTable),
        omit(['startdatearea', 'enddatearea', 'usageid']),
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

function filterInvalidCoordinates(area) {
  return area.coordinates.long != Infinity
}

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

function associateSpecifications(specs, area) {
  return pipe(
    find(propEq('areaid', area.areaid)),
    ifElse(isNil, always(0), pick(['capacity']), unwrapSingleItemArray, Number)
  )(specs)
}

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

function associateParkingEntrance(entrance, area) {
  return pipe(
    find(propEq('areaid', area.areaid)),
    ifElse(
      isNil,
      always(null),
      pipe(
        pick(['enterfrom', 'enteruntil']),
        map(Object.values),
        unwrapArrayValueAtIndex(0)
      )
    )
  )(entrance)
}

function mapAddOpeningHoursAsKeyToArea(area) {
  return area.openingHours
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
