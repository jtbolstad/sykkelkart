import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import BikeMarker from "./components/BikeMarker";
import UserPositionMarker from "./components/UserPositionMarker";
import { fetchStations, fetchStationStatus } from "./services/api";
import { findNearestBike, findNearestDock } from "./utils/findNearestStations";
import { AppState, MapClickHandlerProps, UserPosition } from "./types/app";
import { StationStatus } from "./types/station";
import { LatLngTuple, MapOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

const testmodus = true;

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
    nearestBike: null,
    nearestDock: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stations, statusData] = await Promise.all([
          fetchStations(),
          fetchStationStatus(),
        ]);

        const stationStatus = statusData.reduce(
          (acc: Record<string, StationStatus>, status: StationStatus) => {
            acc[status.station_id] = status;
            return acc;
          },
          {}
        );

        setState((prev) => ({
          ...prev,
          stations,
          stationStatus,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load station data",
          isLoading: false,
        }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (state.userPosition && state.stations.length > 0) {
      const nearestBike = findNearestBike(
        state.stations,
        state.stationStatus,
        state.userPosition
      );
      const nearestDock = findNearestDock(
        state.stations,
        state.stationStatus,
        state.userPosition
      );

      setState((prev) => ({
        ...prev,
        nearestBike,
        nearestDock,
      }));
    }
  }, [state.userPosition, state.stations, state.stationStatus]);

  useEffect(() => {
    if (testmodus) {
      setUserPosition({
        // Tilfeldige koordinater for testing
        lng: 10.7 + Math.random() * 0.1,
        lat: 59.9 + Math.random() * 0.05,
      });
      return;
    }

    // Watch user position
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const setUserPosition = (position: UserPosition) => {
    setState((prev) => ({
      ...prev,
      userPosition: position,
    }));
  };

  if (state.isLoading) return <div>Loading...</div>;
  if (state.error) return <div>{state.error}</div>;

  const osloCenter: LatLngTuple = [59.9139, 10.7522];

  const mapOptions: MapOptions = {
    center: osloCenter,
    zoom: 13,
  };

  return (
    <>
      <div className="infobox">
        <h1>Oslo Bysykkel</h1>
        <ul>
          <li>Ledige sykler og parkering på bysykkelstasjoner i Oslo</li>
          <li>
            Nærmeste sykkel: <b>{state.nearestBike?.name}</b>
          </li>
          <li>
            Nærmeste parkering: <b>{state.nearestDock?.name}</b>
          </li>
        </ul>
      </div>

      <MapContainer {...mapOptions} style={{ height: "100vh", width: "100%" }}>
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
            isNearestBike={station.station_id === state.nearestBike?.station_id}
            isNearestDock={station.station_id === state.nearestDock?.station_id}
          />
        ))}
      </MapContainer>
    </>
  );
}

export default App;
