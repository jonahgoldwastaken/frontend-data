export { createClockFace }

function createClockFace(svg, dimension) {
  const clockFaceG = svg.append('g')
  clockFaceG
    .selectAll('line')
    .data(createClockFaceLines(dimension))
    .enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)

  clockFaceG
    .selectAll('text')
    .data(createClockFaceTimes(dimension))
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', d => d.anchor)
    .attr('alignment-baseline', d => d.baseline)
    .text(d => d.text)
    .classed('clock-hour', true)
}

function createClockFaceLines(dimension) {
  const { half, quarter, threeQuarter, edgePadding } = divideDimension(
    dimension
  )
  return [
    {
      x1: half,
      x2: half,
      y1: edgePadding,
      y2: half - 100,
    },
    {
      x1: threeQuarter,
      x2: half + 50,
      y1: edgePadding,
      y2: half - 100,
    },
    {
      x1: dimension - edgePadding,
      x2: half + 100,
      y1: quarter,
      y2: half - 50,
    },
    {
      x1: dimension - edgePadding,
      x2: half + 100,
      y1: half,
      y2: half,
    },
    {
      x1: dimension - edgePadding,
      x2: half + 100,
      y1: threeQuarter,
      y2: half + 50,
    },
    {
      x1: threeQuarter,
      x2: half + 50,
      y1: dimension - edgePadding,
      y2: half + 100,
    },
    {
      x1: half,
      x2: half,
      y1: dimension - edgePadding,
      y2: half + 100,
    },
    {
      x1: quarter,
      x2: half - 50,
      y1: dimension - edgePadding,
      y2: half + 100,
    },
    {
      x1: edgePadding,
      x2: half - 100,
      y1: threeQuarter,
      y2: half + 50,
    },
    {
      x1: edgePadding,
      x2: half - 100,
      y1: half,
      y2: half,
    },
    {
      x1: edgePadding,
      x2: half - 100,
      y1: dimension / 4,
      y2: half - 50,
    },
    {
      x1: quarter,
      x2: half - 50,
      y1: edgePadding,
      y2: half - 100,
    },
  ]
}

function createClockFaceTimes(dimension) {
  const { half, quarter, threeQuarter } = divideDimension(dimension)
  return [
    {
      x: half,
      y: 0,
      text: '12',
      anchor: 'middle',
      baseline: 'hanging',
    },
    {
      x: threeQuarter,
      y: 0,
      text: '12',
      anchor: 'middle',
      baseline: 'hanging',
    },
    {
      x: dimension,
      y: quarter,
      text: '12',
      anchor: 'end',
      baseline: 'middle',
    },
    {
      x: dimension,
      y: half,
      text: '12',
      anchor: 'end',
      baseline: 'middle',
    },
    {
      x: dimension,
      y: threeQuarter,
      text: '12',
      anchor: 'end',
      baseline: 'middle',
    },
    {
      x: threeQuarter,
      y: dimension,
      text: '12',
      anchor: 'middle',
      baseline: 'bottom',
    },
    {
      x: half,
      y: dimension,
      text: '12',
      anchor: 'middle',
      baseline: 'bottom',
    },
    {
      x: quarter,
      y: dimension,
      text: '12',
      anchor: 'middle',
      baseline: 'bottom',
    },
    {
      x: 0,
      y: threeQuarter,
      text: '12',
      anchor: 'start',
      baseline: 'middle',
    },
    {
      x: 0,
      y: half,
      text: '12',
      anchor: 'start',
      baseline: 'middle',
    },
    {
      x: 0,
      y: quarter,
      text: '12',
      anchor: 'start',
      baseline: 'middle',
    },
    {
      x: quarter,
      y: 0,
      text: '12',
      anchor: 'middle',
      baseline: 'hanging',
    },
  ]
}

function divideDimension(dimension) {
  return {
    edgePadding: 20,
    half: dimension / 2,
    quarter: dimension / 4,
    threeQuarter: (dimension / 4) * 3,
  }
}
