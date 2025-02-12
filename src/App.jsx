import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Popup } from 'react-leaflet'
import axios from 'axios'
import BikeMarker from './components/BikeMarker'
import 'leaflet/dist/leaflet.css'

function App() {
  const [stations, setStations] = useState([])
  const [stationStatus, setStationStatus] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsResponse, statusResponse] = await Promise.all([
          axios.get('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', {
            headers: {
              'Client-Identifier': 'JTBOLSTAD'
            }
          }),
          axios.get('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', {
            headers: {
              'Client-Identifier': 'JTBOLSTAD'
            }
          })
        ])

        setStations(stationsResponse.data.data.stations)
        const statusMap = {}
        statusResponse.data.data.stations.forEach(station => {
          statusMap[station.station_id] = station
        })
        setStationStatus(statusMap)
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