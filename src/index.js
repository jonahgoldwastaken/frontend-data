import hotSpots from './hot-spots.json'
import { createClockFace, createClock } from './d3/clock.js'
import {
  createInitialConfig,
  createScales,
  readyDataForChart,
  createRadialLine,
} from './modules/chart.js'
import { createHotSpotText, updateHotSpotText } from './d3/hotSpot.js'
import { createSVG, selectSVG } from './utilities/chart'

const {
  dimension,
  clockRadius,
  radius,
  defaultTimes,
  defaultDistances,
  defaultTimeType,
} = createInitialConfig(960)

initialiseSVG({ times: defaultTimes })

import('./rdw-data.json')
  .then(
    readyDataForChart(
      hotSpots[0],
      defaultDistances,
      defaultTimes,
      defaultTimeType
    )
  )
  .then(render)

function initialiseSVG({ times }) {
  createSVG(dimension)
    .call(createClock(clockRadius))
    .call(createClockFace(times, clockRadius))
    .call(createHotSpotText(dimension, 'Laden...'))
}

function render(
  data,
  { times, distances, timeType } = {
    times: defaultTimes,
    distances: defaultDistances,
    timeType: defaultTimeType,
  }
) {
  const svg = selectSVG()
  const dataG = svg.append('g')
  const [timeScale, distanceScale] = createScales(times, distances, radius)
  const line = createRadialLine({ distanceScale, timeScale }, timeType)

  dataG
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'dot')
    .attr('transform', d => `translate(${line([d]).slice(1).slice(0, -1)})`)
    .attr('r', 4)
    .attr('class', d =>
      timeType === 'opening'
        ? d.openingHours[0] !== null
          ? 'dot-has-time'
          : 'dot-has-no-time'
        : d.openingHours[1] !== null
        ? 'dot-has-time'
        : 'dot-has-no-time'
    )
  updateHotSpotText(svg, hotSpots[0].name)
}
