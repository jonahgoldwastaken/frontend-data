import { select } from 'd3'
import { createClock, createClockFace } from './d3/clock.js'
import { createHotSpotText, updateHotSpotText } from './d3/hotSpot.js'
import hotSpots from './hot-spots.json'
import {
  createInitialConfig,
  createRadialLine,
  createScales,
  enterDots,
  readyDataForChart,
  resetToaster,
  setToaster,
  updateDots,
} from './modules/chart.js'
import {
  createOrSelectDataGroup,
  createSVG,
  selectSVG,
  updateDistancesLabel,
  updateTimesLabel,
} from './utilities/chart'

window.addEventListener('load', chartApp)

async function chartApp() {
  let {
    dimension,
    clockRadius,
    radius,
    times,
    distances,
    timeType,
    hotSpot,
    showAllData,
  } = createInitialConfig(960, hotSpots[0])

  initialiseApp()

  const { default: dataset } = await import('./rdw-data.json')

  onUpdate()

  function onUpdate() {
    const data = readyDataForChart(
      hotSpot,
      distances,
      times,
      timeType,
      showAllData
    )(dataset)
    render(data, { times, distances, timeType })
  }

  function render(data, { times, distances, timeType }) {
    createClockFace(times, distances, clockRadius)

    const svg = selectSVG()
    const dataG = createOrSelectDataGroup()
    const [timeScale, distanceScale] = createScales(times, distances, radius)
    const line = createRadialLine({ distanceScale, timeScale }, timeType)

    dataG
      .selectAll('circle')
      .data(data)
      .join(enterDots(line), updateDots(line))
      .classed('dot', true)
      .attr('r', 4)
      .classed(
        'dot-has-time',
        d =>
          (timeType === 'opening' && d.openingHours[0]) ||
          (timeType === 'closing' && d.openingHours[1])
      )
      .classed(
        'dot-has-no-time',
        d =>
          (timeType === 'opening' && !d.openingHours[0]) ||
          (timeType === 'closing' && !d.openingHours[1])
      )
      .on('mouseover', setToaster)
      .on('mouseout', resetToaster)

    updateHotSpotText(svg, hotSpot.name)
    updateTimesLabel(times)
    updateDistancesLabel(distances)
  }

  function initialiseApp() {
    createSVG(dimension)
      .call(createClock(clockRadius))
      .call(createHotSpotText(dimension, 'Laden...'))

    createForm()
  }

  function createForm() {
    const form = select('form')

    const hotSpotSelect = form.append('select').on('input', updateHotSpot)

    hotSpotSelect
      .selectAll('option')
      .data(hotSpots)
      .join('option')
      .attr('value', d => d.name)
      .text(d => d.name)

    hotSpotSelect.attr('value', hotSpot)

    const timeTypeSelect = form.append('select').on('change', updateTimeType)
    timeTypeSelect
      .selectAll('option')
      .data([
        { value: 'opening', name: 'Openingstijden' },
        { value: 'closing', name: 'Sluitingstijden' },
      ])
      .join('option')
      .text(d => d.name)
      .attr('value', d => d.value)

    timeTypeSelect.attr('value', 'closing')

    form.append('label').classed('times-label', true)

    form
      .append('button')
      .text('-')
      .attr('type', 'button')
      .on('click', updateTimes(false))
    form
      .append('button')
      .text('+')
      .attr('type', 'button')
      .on('click', updateTimes(true))

    form.append('label').classed('distances-label', true)

    form
      .append('button')
      .text('-')
      .attr('type', 'button')
      .on('click', updateDistances(false))
    form
      .append('button')
      .text('+')
      .attr('type', 'button')
      .on('click', updateDistances(true))

    form
      .append('label')
      .text('Toon parkeerplaatsen zonder openingstijden: ')
      .append('input')
      .attr('type', 'checkbox')
      .attr('checked', () => showAllData)
      .on('change', updateShowAllData)
  }

  function updateHotSpot() {
    const newHotSpot = hotSpots.find(val => val.name === this.value)
    hotSpot = newHotSpot
    onUpdate()
  }

  function updateTimes(addTimes) {
    return () => {
      if (addTimes && times[1] < 24) times = [times[0] + 1, times[1] + 1]
      else if (!addTimes && times[0] > 0) times = [times[0] - 1, times[1] - 1]
      onUpdate()
    }
  }

  function updateDistances(addDistances) {
    return () => {
      if (addDistances) distances = [distances[0] + 1, distances[1] + 1]
      else if (distances[0] > 0)
        distances = [distances[0] - 1, distances[1] - 1]
      onUpdate()
    }
  }

  function updateTimeType() {
    timeType = this.value
    onUpdate()
  }

  function updateShowAllData() {
    showAllData = this.checked
    onUpdate()
  }
}
