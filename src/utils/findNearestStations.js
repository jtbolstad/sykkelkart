import { calculateDistance } from './stationUtils';

// Function to find nearest stations with available bikes and docks
export const findNearestStationsWithAvailability = (userPosition, stations, stationStatus) => {
  if (!userPosition || !stations || !stationStatus) return { nearestBike: null, nearestDock: null };

  const stationsWithDistances = stations.map(station => ({
    ...station,
    distance: calculateDistance(
      userPosition.lat,
      userPosition.lng,
      station.lat,
      station.lon
    )
  }));
  // console.log('stationsWithDistances:', stationsWithDistances);
  const nearestBike = stationsWithDistances
    .filter(station => {
      const status = stationStatus[station.station_id];
      return status && status.num_bikes_available > 0;
    })
    .sort((a, b) => a.distance - b.distance)[0];

  const nearestDock = stationsWithDistances
    .filter(station => {
      const status = stationStatus[station.station_id];
      return status && status.num_docks_available > 0;
    })
    .sort((a, b) => a.distance - b.distance)[0];
  
  return { nearestBike, nearestDock };
};