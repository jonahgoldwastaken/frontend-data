import { range } from 'd3'
import { createTimesArray } from '../utilities/chart.js'

export { createClockFace, createClock }

function createClockFace(times, radius) {
  const data = createTimesArray(times)
  return svg => {
    const textMargin = 35
    const lineMargin = textMargin * 1.75
    const faceG = svg
      .append('g')
      .attr('transform', 'rotate(-90)')
      .selectAll('line')
      .data(range(0, 360, 30))
      .join('g')
      .attr('transform', d => `rotate(${d})`)

    faceG
      .append('line')
      .attr('x1', 100)
      .attr('x2', radius - lineMargin)
      .attr('class', 'clock-hour-line')

    faceG
      .append('text')
      .attr('x', radius - textMargin)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', d => `rotate(${-d + 90} ${radius - textMargin} 0)`)
      .attr('class', 'clock-hour')
      .text(d => data[range(0, 360, 30).indexOf(d)])
  }
}

function createClock(clockRadius) {
  return svg => {
    svg.append('circle').attr('r', clockRadius).attr('class', 'clock')
    svg.append('circle').attr('r', 100).attr('class', 'clock-center')
  }
}
