import axios from 'axios';
import { Station, StationStatus } from '../types/station';

const STATION_INFO_URL = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json';
const STATION_STATUS_URL = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json';

export const fetchStations = async (): Promise<Station[]> => {
  const response = await axios.get(STATION_INFO_URL);
  return response.data.data.stations;
};

export const fetchStationStatus = async (): Promise<StationStatus[]> => {
  const response = await axios.get(STATION_STATUS_URL);
  return response.data.data.stations;
};