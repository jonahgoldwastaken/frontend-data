import { lineRadial } from 'd3'
import { always, filter, pipe, unless } from 'ramda'
import {
  addDistanceToData,
  createDistanceScale,
  createTimeScale,
  filterInvalidData,
  filterOnDistanceToHotSpot,
  filterOnOpeningHours,
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
function createInitialConfig(dimension, hotSpot) {
  return {
    dimension,
    clockRadius: dimension / 2 - 30,
    radius: dimension / 2 - 91.2,
    times: [12, 24],
    distances: [0, 5],
    timeType: 'closing',
    showAllData: true,
    hotSpot,
  }
}

/**
 * Readies dataset for use inside chart.
 *
 * @param {object} hotspot Current hotspot in use.
 * @param {number[]} distances Array with min and max distance.
 * @param {number[]} times Array with min and max times.
 * @param {string} timeType 'opening' or 'closing' time type string.
 * @param {boolean} showAllData Boolean stating if all data should be shown
 * @returns {(object) => object[]} Function that takes a module and returns parsed dataset.
 */
function readyDataForChart(hotspot, distances, times, timeType, showAllData) {
  console.log(showAllData)
  return dataset =>
    pipe(
      addDistanceToData(hotspot),
      filter(filterOnDistanceToHotSpot(distances)),
      filter(filterOnOpeningHours({ times, timeType })),
      unless(() => showAllData, filter(filterInvalidData))
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

/**
 * Creates and returns both the distance and time scale
 *
 * @param {[number, number]} times Array with min and max time
 * @param {[number, number]} distances Array with min and max distance
 * @param {number} range Radius of chart for range in distance scale
 */
function createScales(times, distances, range) {
  return [createTimeScale(times), createDistanceScale(distances, range)]
}
