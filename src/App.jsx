import { useEffect, useState } from 'react'
import { findNearestAvailableStation } from './utils/stationUtils'
import { MapContainer, TileLayer, Popup } from 'react-leaflet'
import { fetchAllStationData } from './services/api'
import BikeMarker from './components/BikeMarker'
import UserPositionMarker from './components/UserPositionMarker'
import 'leaflet/dist/leaflet.css'

function App() {
  const [stations, setStations] = useState([])
  const [stationStatus, setStationStatus] = useState({})
  const [userPosition, setUserPosition] = useState(null)

  const nearestStation = userPosition ? findNearestAvailableStation(userPosition, stations, stationStatus) : null;
  console.log('Nearest available station:', nearestStation);

  useEffect(() => {
    // Watch user position
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { stations, stationStatus } = await fetchAllStationData();
        setStations(stations);
        setStationStatus(stationStatus);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <MapContainer
      center={[59.9139, 10.7522]} // Oslo center coordinates
      zoom={13}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userPosition && <UserPositionMarker position={userPosition} />}
      {stations.map(station => {
        const status = stationStatus[station.station_id]
        if (!status) return null

        return (
          <BikeMarker
            key={station.station_id}
            station={station}
            status={status}
          />
        )
      })}
    </MapContainer>
  )
}

export default App;