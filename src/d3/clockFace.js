export { createClockFace }

function createClockFace(timeScale, times, radius) {
  const data = createTimesArray(times)
  return svg => {
    const textMargin = 35
    const lineMargin = textMargin * 1.75
    const faceG = svg
      .append('g')
      .selectAll('line')
      .data(data)
      .join('g')
      .attr('transform', d => `rotate(${timeScale(d)})`)

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
      .attr(
        'transform',
        d => `rotate(${-timeScale(d)} ${radius - textMargin} 0)`
      )
      .attr('class', 'clock-hour')
      .text(d => d)
  }
}

function createTimesArray(times) {
  return times.reduce(
    (acc, curr) =>
      acc.length === 1
        ? acc.concat([...new Array(11)].map((_, i) => i + 1 + acc[0]))
        : [curr],
    []
  )
}
