import { scaleLinear, select } from 'd3'
import haversine from 'haversine'
import { reduce } from 'ramda'

export {
  createTimesArray,
  filterOnOpeningHours,
  filterOnDistanceToHotSpot,
  addDistanceToData,
  createTimeScale,
  createDistanceScale,
  createSVG,
  selectSVG,
}

/**
 * Maps out all whole numbers between two numbers over array
 *
 * @param {[number, number]} times Array with two numbers
 * @returns {number[]} Mapped array
 */
function createTimesArray(times) {
  return reduce(
    (acc, curr) =>
      acc.length === 1
        ? acc.concat([...new Array(11)].map((_, i) => i + 1 + acc[0]))
        : [curr],
    []
  )(times)
}

/**
 * Checks if distance of area is lower than provided max distance.
 *
 * @param {number[]} distances Array with distances.
 * @returns {(object) => boolean} Function that checks if distance to hotspot is lower than max distance.
 */
function filterOnDistanceToHotSpot(distances) {
  return area => area.distanceToHotSpot < distances[1]
}

/**
 * Checks if openingHours is in between provided time and time type.
 *
 * @param {object} param0 Object with times and timeType.
 * @returns {(object) => boolean} Function that checks if this is true.
 */
function filterOnOpeningHours({ times, timeType }) {
  return area =>
    area.openingHours[0]
      ? timeType === 'opening'
        ? area.openingHours[0] > times[0] && area.openingHours[0] < times[1]
        : area.openingHours[1] > times[0] && area.openingHours[1] < times[1]
      : true
}

/**
 * Calculates and add distance to provided hotspot to areas
 * @param {object} hotSpot HotSpot object
 * @returns {(object[]) => object[]} Function that maps distances
 */
function addDistanceToData(hotSpot) {
  return areas =>
    areas.map(area => ({
      ...area,
      distanceToHotSpot: haversine(
        [area.coordinates.long, area.coordinates.lat],
        [+hotSpot.long, +hotSpot.lat],
        { format: '[lon,lat]' }
      ),
    }))
}

/**
 * Creates D3 linear scale based on times provided
 * @param {[number, number]} times Array with times
 * @returns {*} D3 Linear Scale
 */
function createTimeScale(times) {
  return scaleLinear()
    .domain(times)
    .range([0, 2 * Math.PI])
}

/**
 * Creates D3 Linear Scale based on distances and range provided
 * @param {[number, number]} distances Array with min and max distance
 * @param {number} range Range which is radius of chart
 * @returns {*} D3 Linear Scale
 */
function createDistanceScale(distances, range) {
  return scaleLinear().domain(distances).range([100, range])
}

/**
 * Creates SVG to the size of provided dimension
 * @param {number} dimension Dimension of SVG
 * @returns {*} D3 selection with SVG
 */
function createSVG(dimension) {
  return select('svg')
    .attr('width', dimension)
    .attr('height', dimension)
    .append('g')
    .attr('transform', `translate(${dimension / 2}, ${dimension / 2})`)
}

/**
 * Returns selected SVG
 *
 * @returns {*} SVG
 */
function selectSVG() {
  return select('svg').select('g')
}
