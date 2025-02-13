import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import BikeMarker from './components/BikeMarker';
import UserPositionMarker from './components/UserPositionMarker';
import { fetchStations, fetchStationStatus } from './services/api';
import { findNearestBikeStation, findNearestDockStation } from './utils/findNearestStations';
import { AppState, MapClickHandlerProps, UserPosition } from './types/app';
import { StationStatus } from './types/station';
import { LatLngTuple, MapOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';

function MapClickHandler({ setUserPosition }: MapClickHandlerProps) {
  useMapEvents({
    click: (e: { latlng: { lat: number; lng: number } }) => {
      setUserPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function App() {
  const [state, setState] = useState<AppState>({
    stations: [],
    stationStatus: {},
    userPosition: null,
    nearestBikeStation: null,
    nearestDockStation: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stations, statusData] = await Promise.all([
          fetchStations(),
          fetchStationStatus()
        ]);
        
        const stationStatus = statusData.reduce((acc: Record<string, StationStatus>, status: StationStatus) => {
          acc[status.station_id] = status;
          return acc;
        }, {});

        setState(prev => ({
          ...prev,
          stations,
          stationStatus,
          isLoading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load station data',
          isLoading: false
        }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (state.userPosition && state.stations.length > 0) {
      const nearestBikeStation = findNearestBikeStation(
        state.stations,
        state.stationStatus,
        state.userPosition
      );
      const nearestDockStation = findNearestDockStation(
        state.stations,
        state.stationStatus,
        state.userPosition
      );

      setState(prev => ({
        ...prev,
        nearestBikeStation,
        nearestDockStation
      }));
    }
  }, [state.userPosition, state.stations, state.stationStatus]);

  const setUserPosition = (position: UserPosition) => {
    setState(prev => ({
      ...prev,
      userPosition: position
    }));
  };

  if (state.isLoading) return <div>Loading...</div>;
  if (state.error) return <div>{state.error}</div>;

  const osloCenter: LatLngTuple = [59.9139, 10.7522];

  const mapOptions: MapOptions = {
    center: osloCenter,
    zoom: 13
  };

  return (
    <MapContainer
      {...mapOptions}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler setUserPosition={setUserPosition} />
      {state.userPosition && (
        <UserPositionMarker position={state.userPosition} />
      )}
      {state.stations.map((station) => (
        <BikeMarker
          key={station.station_id}
          station={station}
          status={state.stationStatus[station.station_id]}
          isNearestBike={station.station_id === state.nearestBikeStation?.station_id}
          isNearestDock={station.station_id === state.nearestDockStation?.station_id}
        />
      ))}
    </MapContainer>
  );
}

export default App;