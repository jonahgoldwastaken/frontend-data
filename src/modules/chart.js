import { lineRadial, select } from 'd3'
import { filter, pipe, unless } from 'ramda'
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
  setToaster,
  resetToaster,
  enterDots,
  updateDots,
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
    times: [0, 12],
    distances: [0, 5],
    timeType: 'opening',
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

/**
 * Enter function for D3 selection.join
 *
 * @param {number} dimension Dimension of graph
 * @param {*} line D3 Line Radial
 * @returns {(*) => *} Function that can be used inside .join
 */
function enterDots(line) {
  return selection =>
    selection
      .append('circle')
      .attr('transform', `translate(0px, 0px)`)
      .call(enter =>
        enter
          .transition()
          .duration(100)
          .attr(
            'transform',
            d => `translate(${line([d]).slice(1).slice(0, -1)})`
          )
      )
}

/**
 * Update function for D3 selection.join
 *
 * @param {*} line D3 Line Radial
 * @returns {(*) => *} Function that can be used inside .join
 */
function updateDots(line) {
  return selection =>
    selection.call(update =>
      update
        .transition()
        .duration(100)
        .attr('transform', d => `translate(${line([d]).slice(1).slice(0, -1)})`)
    )
}

/**
 * Sets up the toaster with data of currently hovered object
 *
 * @param {MouseEvent} e Mouse events
 * @param {object} data Data object passed by D3
 */
function setToaster(e, data) {
  return select('.toaster')
    .html(
      `<ul>
          <li>Afstand: ${data.distanceToHotSpot}KM</li>
          <li>Capaciteit: ${data.capacity}</li>
          <li>
            Openingstijd: ${
              `${data.openingHours[0]}:00 uur` || 'Niet opgegeven'
            }
          </li>
          <li>
            Sluitingstijd: ${
              `${data.openingHours[1]}:00 uur` || 'Niet opgegeven'
            }
          </li>
        </ul>`
    )
    .style('top', `${e.pageY - window.scrollY}px`)
    .style('left', `${e.pageX - window.scrollX}px`)
    .classed('toaster-shown', true)
}

/**
 * Removes the toaster from view
 */
function resetToaster() {
  return select('.toaster').classed('toaster-shown', false)
}
