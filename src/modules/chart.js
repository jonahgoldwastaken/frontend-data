import { lineRadial } from 'd3'
import { pipe, filter } from 'ramda'
import {
  addDistanceToData,
  filterOnDistanceToHotSpot,
  filterOnOpeningHours,
  createTimeScale,
  createDistanceScale,
} from '../utilities/chart.js'

export {
  createInitialConfig,
  createScales,
  readyDataForChart,
  createRadialLine,
}

/**
 * Returns object with default config values for chart.
 *
 * @param {number} dimension Dimension of square SVG.
 * @returns {object} Object with default values
 */
function createInitialConfig(dimension) {
  return {
    dimension: dimension,
    clockRadius: dimension / 2 - 30,
    radius: dimension / 2 - 91.2,
    defaultTimes: [12, 24],
    defaultDistances: [0, 5],
    defaultTimeType: 'closing',
  }
}

/**
 * Readies dataset for use inside chart.
 *
 * @param {object} hotspot Current hotspot in use.
 * @param {number[]} distances Array with min and max distance.
 * @param {number[]} times Array with min and max times.
 * @param {string} timeType 'opening' or 'closing' time type string.
 * @returns {(object) => object[]} Function that takes a module and returns parsed dataset.
 */
function readyDataForChart(hotspot, distances, times, timeType) {
  return ({ default: dataset }) =>
    pipe(
      addDistanceToData(hotspot),
      filter(filterOnDistanceToHotSpot(distances)),
      filter(filterOnOpeningHours({ times, timeType }))
    )(dataset)
}

/**
 * Create a D3 Radial Line that can be used to cast dataset on chart.
 *
 * @param {object} param0 object containing timeScale and distanceScale
 * @param {string} timeType 'opening' and 'closing' timeType
 * @returns Radial Line
 */
function createRadialLine({ timeScale, distanceScale }, timeType) {
  return lineRadial()
    .radius(d => distanceScale(d.distanceToHotSpot))
    .angle(d =>
      timeScale(timeType === 'opening' ? d.openingHours[0] : d.openingHours[1])
    )
}

function createScales(times, distances, range) {
  return [createTimeScale(times), createDistanceScale(distances, range)]
}
