// import { render } from '@testing-library/react';
// import { describe, it } from 'vitest';
// import App from './App';

// describe('App', () => {
//   it('renders without crashing', () => {
//     render(<App />);
//   });
// });

import { render, screen } from "@testing-library/react";
import { expect } from "@testing-library/jest-dom";
import App from "./App";
import BikeMarker from "./components/BikeMarker";
import { MapContainer } from "react-leaflet";

// Mock API response data
const mockStations = [
  {
    station_id: "1",
    name: "Test Station",
    address: "123 Test Ave",
    lat: 59.9139,
    lon: 10.7522,
    capacity: 10,
    cross_street: "Test St",
  },
];

const mockStatus = {
  "1": {
    num_bikes_available: 5,
    num_docks_available: 3,
    station_id: 1,
    is_installed: true,
    is_renting: true,
    is_returning: true,
    last_reported: 1626828000,
    vehicle_types_available: [
      {
        vehicle_type_id: "bike",
        count: 5,
      },
      {
        vehicle_type_id: "ebike",
        count: 0,
      },
    ],
  },
};

jest.mock("axios", () => ({
  get: jest.fn((url) => {
    if (url.includes("station_information")) {
      return Promise.resolve({ data: { data: { stations: mockStations } } });
    }
    if (url.includes("station_status")) {
      return Promise.resolve({
        data: { data: { stations: [{ ...mockStatus["1"] }] } },
      });
    }
  }),
}));

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    const mapElement = screen.getByRole("region");
    expect(mapElement).toBeInTheDocument();
  });

  test("renders stations", async () => {
    render(<App />);
    const marker = await screen.findByText(/5\/3/);
    expect(marker).toBeInTheDocument();
  });
});

describe("BikeMarker Component", () => {
  test("renders bike marker with correct availability", () => {
    render(
      <MapContainer>
        <BikeMarker station={mockStations[0]} status={mockStatus["1"]} />
      </MapContainer>
    );
    const marker = screen.getByText(/5\/3/);
    expect(marker).toBeInTheDocument();
  });
});
