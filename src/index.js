import { select, lineRadial } from 'd3'
import { pipe, filter } from 'ramda'
import hotSpots from './hot-spots.json'
import rdwData from './rdw-data.json'
import { createClockFace } from './d3/clockFace.js'
import { createScales } from './d3/scales.js'
import { createHotSpotText, updateHotSpotText } from './d3/hotSpot.js'
import { addDistanceToData } from './d3/distance.js'

const dimension = 960
const clockRadius = dimension / 2 - 30
const radius = clockRadius - 61.25
const defaultDistances = [0, 5]
const defaultTimes = [12, 24]
let distances = defaultDistances
let times = defaultTimes

initialiseD3()

function initialiseD3() {
  const svg = createSVG(dimension)

  svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
  svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  svg.call(createClockFace(times, clockRadius))
  svg.call(createHotSpotText(dimension, 'Laden...'))

  populateGraph(rdwData)
}

function populateGraph(dataset) {
  const filteredData = pipe(
    calculateDistanceToHotSpot(hotSpots[0]),
    filter(filterOnDistanceToHotSpot)
  )(dataset)
  const [timeScale, distanceScale] = createScales(times, distances, radius)
  const line = lineRadial()
    .radius(d => distanceScale(d.distanceToHotSpot))
    .angle(d => timeScale(d.openingHours[1]))
  const svg = selectSVG()
  const dataG = svg.append('g')

  dataG
    .selectAll('circle')
    .data(filteredData)
    .join('circle')
    .attr('class', 'dot')
    .attr('transform', d => `translate(${line([d]).slice(1).slice(0, -1)})`)
    .attr('r', 4)
    .attr('class', d =>
      d.openingHours[1] !== null ? 'dot-has-time' : 'dot-has-no-time'
    )

  updateHotSpotText(svg, hotSpots[0].name)
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

function calculateDistanceToHotSpot(hotspot) {
  return dataset => addDistanceToData(hotspot)(dataset)
}

function filterOnDistanceToHotSpot(area) {
  return area.distanceToHotSpot < distances[1]
}
