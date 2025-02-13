import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { UserPosition } from '../types/app';

interface UserPositionMarkerProps {
  position: UserPosition;
}

function UserPositionMarker({ position }: UserPositionMarkerProps) {
  const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="background-color: #0000ff; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <Marker position={[position.lat, position.lng]} icon={userIcon}>
      <Popup>Your Location</Popup>
    </Marker>
  );
}

export default UserPositionMarker;