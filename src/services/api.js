import axios from 'axios';

const API_BASE_URL = 'https://gbfs.urbansharing.com/oslobysykkel.no';
const CLIENT_IDENTIFIER = 'JTBOLSTAD';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Client-Identifier': CLIENT_IDENTIFIER
  }
});

export const fetchStationInformation = () => {
  return api.get('/station_information.json');
};

export const fetchStationStatus = () => {
  return api.get('/station_status.json');
};

export const fetchAllStationData = async () => {
  try {
    const [stationsResponse, statusResponse] = await Promise.all([
      fetchStationInformation(),
      fetchStationStatus()
    ]);

    const stations = stationsResponse.data.data.stations;
    const statusMap = {};
    statusResponse.data.data.stations.forEach(station => {
      statusMap[station.station_id] = station;
    });

    return {
      stations,
      stationStatus: statusMap
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};