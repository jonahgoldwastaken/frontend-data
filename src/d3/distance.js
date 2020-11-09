import haversine from 'haversine'

export { addDistanceToData }

function addDistanceToData(hotSpot) {
  return manager =>
    manager.parkingAreas.map(area => ({
      ...area,
      distanceToHotSpot: haversine(
        [area.coordinates.long, area.coordinates.lat],
        [+hotSpot.long, +hotSpot.lat],
        { format: '[lon,lat]' }
      ),
    }))
}
