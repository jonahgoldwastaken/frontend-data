export { createHotSpotText }

function createHotSpotText(svg) {
  svg
    .append('foreignObject')
    .attr('width', 200)
    .attr('height', 200)
    .attr('x', 412)
    .attr('y', 412)
    .append('xhtml:p')
    .text('Melkweg')
    .classed('hot-spot', true)
}
