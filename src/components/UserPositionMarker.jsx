import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'

function UserPositionMarker({ position }) {
  const divIcon = useMemo(() => {
    return L.divIcon({
      className: 'user-position-marker',
      html: '📍',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    })
  }, [])

  return (
    <Marker position={[position.lat, position.lng]} icon={divIcon}>
      <Popup>
        Your current location
      </Popup>
    </Marker>
  )
}

export default UserPositionMarker