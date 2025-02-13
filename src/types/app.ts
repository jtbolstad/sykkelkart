import { Station, StationStatus } from './station';

export interface UserPosition {
  lat: number;
  lng: number;
}

export interface MapClickHandlerProps {
  setUserPosition: (position: UserPosition) => void;
}

export interface AppState {
  stations: Station[];
  stationStatus: Record<string, StationStatus>;
  userPosition: UserPosition | null;
  nearestBike: Station | null;
  nearestDock: Station | null;
  isLoading: boolean;
  error: string | null;
}