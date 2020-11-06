import { select, scaleLinear } from 'd3'
// import { andThen, pipe } from 'ramda'
// import { areaManagerMapper } from './helpers/RDWData.js'
// import { fetchAndParseMultipleJson } from './modules/fetch.js'
import { createClockFace } from './d3/clockFace'
// import { createHotSpotText } from './d3/hotSpot'

// parseRDWData([
//   'https://opendata.rdw.nl/resource/2uc2-nnv3.json?$limit=900', // area managers
//   'https://opendata.rdw.nl/resource/534e-5vdg.json?$limit=4100', // fare parts
//   'https://opendata.rdw.nl/resource/nfzq-8g7y.json?$limit=1600', // fare calculations
//   'https://opendata.rdw.nl/resource/adw6-9hsg.json?$limit=5000', // parking areas
//   'https://opendata.rdw.nl/resource/qidm-7mkf.json?$limit=1600', // usage goal
//   'https://opendata.rdw.nl/resource/b3us-f26s.json?$limit=2100', // area specifications
//   'https://opendata.rdw.nl/resource/nsk3-v9n7.json?$limit=5300', // geometry parking area
//   'https://opendata.rdw.nl/resource/figd-gux7.json?$limit=900', // parking open
//   'https://opendata.rdw.nl/resource/edv8-qiyg.json?$limit=700', // parking entrance
// ]).then(initialiseD3)
//
// async function parseRDWData(uri) {
//   return await pipe(fetchAndParseMultipleJson, andThen(areaManagerMapper))(uri)
// }

initialiseD3(['hoi'])

function initialiseD3() {
  const dimension = 960
  const radius = dimension / 2 - 30
  const defaultDistances = [0, 10]
  const defaultTimes = [0, 12]

  const svg = select('svg')
    .attr('width', dimension)
    .attr('height', dimension)
    .append('g')
    .attr('transform', `translate(${dimension / 2}, ${dimension / 2})`)

  const distanceScale = scaleLinear()
    .domain(defaultDistances)
    .range([0, radius])
  const timeScale = scaleLinear().domain(defaultTimes).range([0, 360])

  svg.append('circle').attr('r', radius).attr('fill', 'none').attr('stroke', 'black')

  svg.call(createClockFace(timeScale))
}
