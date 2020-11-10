import { scaleLinear } from 'd3'

export { createScales }

function createScales(times, distances, range) {
  return [createTimeScale(times), createDistanceScale(distances, range)]
}

function createTimeScale(times) {
  return scaleLinear()
    .domain(times)
    .range([0, 2 * Math.PI])
}

function createDistanceScale(distances, range) {
  return scaleLinear().domain(distances).range([100, range])
}
