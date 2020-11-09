export { createHotSpotText }

function createHotSpotText(dimension, text) {
  return svg => {
    const size = 100
    const position = dimension / 2 - size / 2
    svg
      .append('foreignObject')
      .attr('width', size)
      .attr('height', size)
      .attr('y', position)
      .attr('x', position)
      .append('xhtml:p')
      .text(text)
      .classed('hot-spot', true)

    return function updateHotspot(text) {
      svg.select('foreignObject').select('p').text(text)
    }
  }
}
