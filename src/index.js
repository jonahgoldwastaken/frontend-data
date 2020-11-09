import { select } from 'd3'
import { flatten, map, andThen, pipe, filter } from 'ramda'
import { areaManagerMapper } from './helpers/RDWData.js'
import { fetchAndParseMultipleJson } from './modules/fetch.js'
import hotSpots from './hot-spots.json'
import { createClockFace } from './d3/clockFace.js'
import { createScales } from './d3/scales.js'
import { createHotSpotText } from './d3/hotSpot.js'
import { addDistanceToData } from './d3/distance.js'

const dimension = 960
const clockRadius = dimension / 2 - 30
const radius = clockRadius - 61.25
const defaultDistances = [0, 5]
const defaultTimes = [0, 12]
let distances = defaultDistances
let times = defaultTimes

parseRDWData([
  'https://opendata.rdw.nl/resource/2uc2-nnv3.json?$limit=900', // area managers
  'https://opendata.rdw.nl/resource/534e-5vdg.json?$limit=4100', // fare parts
  'https://opendata.rdw.nl/resource/nfzq-8g7y.json?$limit=1600', // fare calculations
  'https://opendata.rdw.nl/resource/adw6-9hsg.json?$limit=5000', // parking areas
  'https://opendata.rdw.nl/resource/qidm-7mkf.json?$limit=1600', // usage goal
  'https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=2100', // area specifications
  'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=5300', // geometry parking area
  'https://opendata.rdw.nl/resource/figd-gux7.json?$limit=900', // parking open
  'https://opendata.rdw.nl/resource/edv8-qiyg.json?$limit=700', // parking entrance
]).then(populateGraph)

async function parseRDWData(uri) {
  return await pipe(fetchAndParseMultipleJson, andThen(areaManagerMapper))(uri)
}

initialiseD3()

function initialiseD3() {
  const [timeScale] = createScales([times, distances, radius])
  const svg = createSVG(dimension)

  svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
  svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  svg.call(createClockFace(timeScale, times, clockRadius))
  svg.call(createHotSpotText(dimension, 'Laden...'))
}

function populateGraph(dataset) {
  const [timeScale, distanceScale] = createScales([times, distances, radius])
  const filteredData = pipe(
    calculateAllParkingManagers(hotSpots[0]),
    filter(filterOnDistanceToHotSpot)
  )(dataset)
  filteredData.forEach(item => console.log(item.description, item.openingHours))
  const svg = selectSVG()
  const dataG = svg.append('g').attr('transform', 'rotate(-90)')
  dataG
    .selectAll('circle')
    .data(filteredData)
    .join('circle')
    .attr('class', 'dot')
    .attr('transform', d => {
      // get angle and radius
      const an = timeScale(Math.random() * 12),
        ra = distanceScale(d.distanceToHotSpot),
        x = ra * Math.cos(an),
        y = ra * Math.sin(an)
      return `translate(${[x, y]})`
    })
    .attr('r', 4)
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

function calculateAllParkingManagers(hotspot) {
  return dataset => pipe(map(addDistanceToData(hotspot)), flatten)(dataset)
}

function filterOnDistanceToHotSpot(area) {
  return area.distanceToHotSpot < distances[1]
}
