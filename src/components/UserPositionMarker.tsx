import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { UserPosition } from "../types/app";

interface UserPositionMarkerProps {
  position: UserPosition;
}

function UserPositionMarker({ position }: UserPositionMarkerProps) {
  const userIcon = L.divIcon({
    className: "user-position-marker",
    html: "📍",
    iconSize: [60, 60],
    iconAnchor: [50, 70],
  });

  return (
    <Marker position={[position.lat, position.lng]} icon={userIcon}>
      <Popup>Her er du</Popup>
    </Marker>
  );
}

export default UserPositionMarker;
