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
  nearestBikeStation: Station | null;
  nearestDockStation: Station | null;
  isLoading: boolean;
  error: string | null;
}