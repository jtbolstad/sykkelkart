import { Station, StationStatus } from '../types/station';
import { UserPosition } from '../types/app';
import { calculateDistance } from './station-utils';

export function findNearestBike(
  stations: Station[],
  stationStatus: Record<string, StationStatus>,
  userPosition: UserPosition
): Station | null {
  return stations
    .filter(station => {
      const status = stationStatus[station.station_id];
      return status && status.is_installed && status.is_renting && status.num_bikes_available > 0;
    })
    .reduce((nearest, station) => {
      const distance = calculateDistance(
        userPosition.lat,
        userPosition.lng,
        station.lat,
        station.lon
      );
      
      if (!nearest || distance < calculateDistance(
        userPosition.lat,
        userPosition.lng,
        nearest.lat,
        nearest.lon
      )) {
        return station;
      }
      return nearest;
    }, null as Station | null);
}

export function findNearestDock(
  stations: Station[],
  stationStatus: Record<string, StationStatus>,
  userPosition: UserPosition
): Station | null {
  return stations
    .filter(station => {
      const status = stationStatus[station.station_id];
      return status && status.is_installed && status.is_returning && status.num_docks_available > 0;
    })
    .reduce((nearest, station) => {
      const distance = calculateDistance(
        userPosition.lat,
        userPosition.lng,
        station.lat,
        station.lon
      );
      
      if (!nearest || distance < calculateDistance(
        userPosition.lat,
        userPosition.lng,
        nearest.lat,
        nearest.lon
      )) {
        return station;
      }
      return nearest;
    }, null as Station | null);
}