import { range, scaleLinear } from 'd3'
import {
  createOrSelectClockFaceGroup,
  createTimesArray,
} from '../utilities/chart.js'

export { createClockFace, createClock }

function createClockFace(times, distances, radius) {
  // This function is written with the help of this example by Vikky Ambarkar: https://bl.ocks.org/vikkya/09014cc55d4475b60618e5df5432c808
  const clockRange = range(0, 360, 30)
  const data = createTimesArray(times)
  const textMargin = 35
  const lineMargin = textMargin * 1.75
  const [clockTimeScale, clockDistanceScale] = createClockScales(
    times,
    distances,
    radius - lineMargin
  )

  const faceTimeG = createOrSelectClockFaceGroup()
    .selectAll('g.clock-time-group')
    .data(data)
    .join('g')
    .classed('clock-time-group', true)
    .attr(
      'transform',
      d => `rotate(${clockRange[clockRange.indexOf(clockTimeScale(d))]})`
    )

  faceTimeG
    .selectAll('text')
    .data(d => [d])
    .join('text')
    .text(d => d)
    .attr('x', radius - textMargin)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr(
      'transform',
      d =>
        `rotate(-${clockRange[clockRange.indexOf(clockTimeScale(d))] + 270} ${
          radius - textMargin
        } 0)`
    )
    .attr('class', 'clock-time')

  faceTimeG
    .append('line')
    .attr('x1', 100)
    .attr('x2', radius - lineMargin)
    .attr('class', 'clock-line')

  const faceDistancesG = createOrSelectClockFaceGroup()
    .selectAll('g.clock-distance-group')
    .data(range(...distances, 1))
    .join('g')
    .classed('clock-distance-group', true)
    .attr('transform', 'rotate(90)')

  faceDistancesG
    .selectAll('circle')
    .data(d => [d + 1])
    .join('circle')
    .attr('r', clockDistanceScale)
    .attr('class', 'clock-line clock-line-small')

  faceDistancesG
    .selectAll('text')
    .data(d => [d + 1])
    .join('text')
    .text(d => `${d}km`)
    .attr('y', d => -clockDistanceScale(d) - 5)
    .attr('transform', 'rotate(15)')
    .attr('class', 'clock-distance')
    .style('text-anchor', 'middle')
    .attr('fill', 'black')
}

function createClock(clockRadius) {
  return svg => {
    svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
    svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  }
}

function createClockScales(times, distances, radius) {
  return [
    scaleLinear().domain(times).range([0, 360]),
    scaleLinear().domain(distances).range([100, radius]),
  ]
}
