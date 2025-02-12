import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'

function BikeMarker({ station, status, isNearestBike, isNearestDock }) {
  const { lat, lon, name, address } = station
  const { num_bikes_available, num_docks_available } = status
  const isNearest = isNearestBike || isNearestDock

  const divIcon = useMemo(() => {
    const hasAvailableBikes = num_bikes_available > 0
    return L.divIcon({
      className: '',
      html: `<div class="bike-marker ${hasAvailableBikes ? 'available' : 'unavailable'} ${isNearest ? 'nearest' : ''}" 
        style="${isNearest ? 'transform: scale(2);' : ''}">
        ${num_bikes_available}/${num_docks_available}
      </div>`
    })
  }, [num_bikes_available, num_docks_available])

  return (
    <Marker 
      position={[lat, lon]} 
      icon={divIcon}
      style={{ width: '100px;', height: 'auto' }}
    >
      <Popup>
        <div>
          <h3>{name}</h3>
          <p>{address}</p>
          <p>Available bikes: {num_bikes_available}</p>
          <p>Available docks: {num_docks_available}</p>
          <p>Lat: {lat}</p>
          <p>Lon:: {lon}</p>
        </div>
      </Popup>
    </Marker>
  )
}

export default BikeMarker