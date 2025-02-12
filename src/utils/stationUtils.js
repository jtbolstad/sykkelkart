// Haversine formula to calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// export const findNearestAvailableStation = (userPosition, stations, stationStatus) => {
//   if (!userPosition || !stations || !stationStatus) return null;

//   return stations
//     .filter(station => {
//       const status = stationStatus[station.station_id];
//       return status && status.num_bikes_available > 0;
//     })
//     .reduce((nearest, station) => {
//       const distance = calculateDistance(
//         userPosition.lat,
//         userPosition.lng,
//         station.lat,
//         station.lon
//       );

//       if (!nearest || distance < nearest.distance) {
//         return { station, distance };
//       }
//       return nearest;
//     }, null);
// };