import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BikeMarkerProps } from '../types/station';

function BikeMarker({ station, status, isNearestBike, isNearestDock }: BikeMarkerProps) {
  const getBikeIcon = () => {
    const color = isNearestBike ? '#00ff00' : 
                 isNearestDock ? '#0000ff' : 
                 '#ff0000';
                 
    return L.divIcon({
      className: 'custom-bike-icon',
      html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  return (
    <Marker 
      position={[station.lat, station.lon]} 
      icon={getBikeIcon()}
    >
      <Popup>
        <div>
          <h3>{station.name}</h3>
          <p>Available bikes: {status.num_bikes_available}</p>
          <p>Available docks: {status.num_docks_available}</p>
          <p>Status: {
            !status.is_installed ? "Not Installed" :
            !status.is_renting ? "Not Renting" :
            !status.is_returning ? "Not Accepting Returns" :
            "Operational"
          }</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default BikeMarker;