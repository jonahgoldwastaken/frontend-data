import { range, scaleLinear } from 'd3'
import {
  createOrSelectClockFaceGroup,
  createTimesArray,
} from '../utilities/chart.js'

export { createClockFace, createClock }

function createClockFace(times, radius) {
  const clockRange = range(0, 360, 30)
  const clockScale = scaleLinear().domain(times).range([0, 360])
  const data = createTimesArray(times)
  const textMargin = 35
  const lineMargin = textMargin * 1.75

  const faceG = createOrSelectClockFaceGroup()
    .selectAll('g')
    .data(data)
    .join('g')
    .attr(
      'transform',
      d => `rotate(${clockRange[clockRange.indexOf(clockScale(d))]})`
    )

  faceG
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
        `rotate(-${clockRange[clockRange.indexOf(clockScale(d))] + 270} ${
          radius - textMargin
        } 0)`
    )
    .attr('class', 'clock-hour')

  faceG
    .append('line')
    .attr('x1', 100)
    .attr('x2', radius - lineMargin)
    .attr('class', 'clock-hour-line')
}

function createClock(clockRadius) {
  return svg => {
    svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
    svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  }
}
