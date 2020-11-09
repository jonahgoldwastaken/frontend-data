import { select, scaleLinear } from 'd3'
// import { andThen, pipe } from 'ramda'
// import { areaManagerMapper } from './helpers/RDWData.js'
// import { fetchAndParseMultipleJson } from './modules/fetch.js'
import { createClockFace } from './d3/clockFace.js'
import { createScales } from './d3/scales.js'
import { createHotSpotText } from './d3/hotSpot.js'

initialiseD3()

function initialiseD3() {
  const dimension = 960
  const clockRadius = dimension / 2 - 30
  const radius = clockRadius - 61.25
  const defaultDistances = [0, 10]
  const defaultTimes = [2, 14]
  const [timeScale, distanceScale] = createScales([
    defaultTimes,
    defaultDistances,
    radius,
  ])
  const svg = createSVG(dimension)
  svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
  svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  svg.call(createClockFace(timeScale, defaultTimes, clockRadius))
  svg.call(createHotSpotText(dimension, 'Melkweg'))
}

function createSVG(dimension) {
  return select('svg')
    .attr('width', dimension)
    .attr('height', dimension)
    .append('g')
    .attr('transform', `translate(${dimension / 2}, ${dimension / 2})`)
}

function selectSVG() {
  return select('svg').select('g')
}
