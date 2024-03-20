import { formatStation } from "./your-module-file"; // Update with the correct path to your module file

// Mocking colors object
jest.mock("../map/Map", () => ({
  colors: {
    onTime: "green",
    late: "red",
    early: "orange",
  },
}));

describe("formatStation", () => {
  it("should format station with pass data correctly", () => {
    const station = {
      pass: "0800",
      latLong: { latitude: 0, longitude: 0 },
    };

    const formattedStation = formatStation(station);

    expect(formattedStation.isPass).toBe(true);
    expect(formattedStation.pass.planned).toBe("08:00");
    expect(formattedStation.pass.actual).toBe("08:00");
    expect(formattedStation.pass.statusColor).toBe("green");
  });

  it("should format station with departure and arrival data correctly", () => {
    const station = {
      plannedDeparture: new Date("2024-03-19T08:00:00Z"),
      actualDeparture: new Date("2024-03-19T08:05:00Z"),
      plannedArrival: new Date("2024-03-19T09:00:00Z"),
      actualArrival: new Date("2024-03-19T09:10:00Z"),
      latLong: { latitude: 0, longitude: 0 },
    };

    const formattedStation = formatStation(station);

    expect(formattedStation.status).toBe("Late");
    expect(formattedStation.statusColor).toBe("red");
    expect(formattedStation.departure.planned).toBe("08:00");
    expect(formattedStation.departure.actual).toBe("08:05");
    expect(formattedStation.departure.delayInMinutes).toBe(5);
    expect(formattedStation.arrival.planned).toBe("09:00");
    expect(formattedStation.arrival.actual).toBe("09:10");
    expect(formattedStation.arrival.delayInMinutes).toBe(10);
  });

  it("should handle missing data gracefully", () => {
    const station = {}; // No data provided

    const formattedStation = formatStation(station);

    // Check if defaults are set correctly
    expect(formattedStation.isPass).toBe(false);
    expect(formattedStation.pass).toBeNull();
    expect(formattedStation.departure).toBeNull();
    expect(formattedStation.arrival).toBeNull();
  });

  it("should throw an error for invalid station data", () => {
    const station = null; // Invalid station data

    expect(() => formatStation(station)).toThrow("Error mapping train stations");
  });
});
