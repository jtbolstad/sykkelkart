export interface Station {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
}

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
}

export interface BikeMarkerProps {
  station: Station;
  status: StationStatus;
  isNearestBike: boolean;
  isNearestDock: boolean;
}