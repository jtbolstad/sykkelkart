import { useEffect, useState } from 'react'
import { findNearestStationsWithAvailability } from './utils/findNearestStations'
import { MapContainer, TileLayer, Popup, useMapEvents } from 'react-leaflet'
import { fetchAllStationData } from './services/api'
import BikeMarker from './components/BikeMarker'
import UserPositionMarker from './components/UserPositionMarker'
import 'leaflet/dist/leaflet.css'
import './styles.css';

const testmodus = true;

function MapClickHandler({ setUserPosition }) {
  useMapEvents({
    click: (e) => {
      setUserPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    
    },
  });
  return null;
}

function App() {
  const [stations, setStations] = useState([])
  const [stationStatus, setStationStatus] = useState({})
  const [userPosition, setUserPosition] = useState(null)
  const [nearestBike, setNearestBike] = useState(null)
  const [nearestElectricBike, setnearestElectricBike] = useState(null)
  const [nearestDock, setNearestDock] = useState(null)

  useEffect(() => {
    const { nearestBike, nearestElectricBike, nearestDock } = userPosition 
    ? findNearestStationsWithAvailability(userPosition, stations, stationStatus) 
    : { nearestBike: null, nearestElectricBike: null, nearestDock: null };
    setNearestBike(nearestBike);
    setnearestElectricBike(nearestElectricBike);
    setNearestDock(nearestDock);
  }, [userPosition, stations, stationStatus]) 


  useEffect(() => {
    if (testmodus) {
      setUserPosition({
        // Tilfeldige koordinater for testing
        lng: 10.7 + (Math.random() * 0.1),
        lat: 59.9 + (Math.random() * 0.05)
      });
      return;
    }

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
    <>
      <div className="infobox">
        <h1>Oslo Bysykkel</h1>
        <p>Antall ledige sykler og ledige plasser på bysykkelstasjoner i Oslo </p>
        <p>Nærmeste sykkel: <b>{nearestBike?.name}</b></p>
        <p>Nærmeste el-sykkel: <b>{nearestElectricBike?.name || 'Ikke tilgjengelig'}</b></p>
        <p>Nærmeste parkering: <b>{nearestDock?.name}</b></p>
      </div>
      <MapContainer
        center={[59.9139, 10.7522]} // Oslo center coordinates
        zoom={13}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setUserPosition={setUserPosition} />
        {userPosition && <UserPositionMarker position={userPosition} />}
        {stations.map(station => {
          const status = stationStatus[station.station_id]
          if (!status) return null

          // TODO: ErrorBoundary?

          return (
            <BikeMarker
              key={station.station_id}
              station={station}
              status={status}
              isNearestBike={nearestBike && nearestBike.station_id === station.station_id}
              isNearestDock={nearestDock && nearestDock.station_id === station.station_id}
            />
          )
        })}
      </MapContainer>
    </>
  )
} 
export default App;