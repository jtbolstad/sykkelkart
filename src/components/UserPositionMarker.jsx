import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'

function UserPositionMarker({ position }) {
  const divIcon = useMemo(() => {
    return L.divIcon({
      className: 'user-position-marker',
      html: '📍',
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    })
  }, [])

  return (
    <Marker position={[position.lat, position.lng]} icon={divIcon}>
      <Popup>
        Du er her
      </Popup>
    </Marker>
  )
}

export default UserPositionMarker