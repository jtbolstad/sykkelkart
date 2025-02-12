import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'

// TODO: Add update time to map (remove from popup - seems to be the same for all)
// TODO: Add refresh button/toggle

function BikeMarker({ station, status, isNearestBike, isNearestDock }) {
  const { lat, lon, name, address } = station

  const { num_bikes_available, num_docks_available, last_reported, vehicle_types_available} = status;
  const isNearest = isNearestBike || isNearestDock
  const EBIKETYPE = 1;
  const esykler = vehicle_types_available[EBIKETYPE].count;

  const divIcon = useMemo(() => {
    const hasAvailableBikes = num_bikes_available > 0
    return L.divIcon({
      className: '',
      html: `<div class="bike-marker ${hasAvailableBikes ? 'available' : 'unavailable'} ${isNearest ? 'nearest' : ''}" 
        style="${isNearest ? 'transform: scale(2);' : ''}">
        ${num_bikes_available}/${num_docks_available}
      </div>`
    })
  }, [num_bikes_available, num_docks_available, isNearest])

  const oppdatert = new Date(last_reported * 1000).toLocaleString();
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
          <p>Ledige sykler: {num_bikes_available}</p>
          <p>Herav esykler: {esykler}</p>
          <p>Lat: {lat}</p>
          <p>Lon: {lon}</p>
          <p>Sist oppdatert: {oppdatert}</p> 
        </div>
      </Popup>
    </Marker>
  )
}

export default BikeMarker