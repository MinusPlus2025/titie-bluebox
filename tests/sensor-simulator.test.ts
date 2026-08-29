import { describe, expect, it } from "vitest";

import { simulateSensorWindow, type SimulationScenario } from "../src/simulator/sensor-simulator.js";

const scenario: SimulationScenario = {
  zone: "knee_leg",
  seed: 17,
  startTime: "2026-08-28T22:00:00.000Z",
  sampleCount: 4,
  intervalMinutes: 5,
  initial: {
    localSkinTemp: 33.2,
    contactTemp: 29.6,
    localMicroclimateTemp: 28.8,
    localHumidity: 54,
    bodyAverageSkinTemp: 33.5,
    contactState: "CONTACT",
    movement: 0.1
  },
  changePerMinute: {
    localSkinTemp: -0.05,
    contactTemp: -0.02,
    localMicroclimateTemp: 0,
    localHumidity: 0.2,
    bodyAverageSkinTemp: 0,
    movement: 0
  },
  jitter: 0
};

describe("simulateSensorWindow", () => {
  it("returns identical samples for identical scenario inputs", () => {
    expect(simulateSensorWindow(scenario)).toEqual(simulateSensorWindow(scenario));
  });

  it("applies changes by elapsed time and never reads the wall clock", () => {
    const result = simulateSensorWindow(scenario);

    expect(result.samples[3]).toMatchObject({
      timestamp: "2026-08-28T22:15:00.000Z",
      localSkinTemp: 32.45,
      contactTemp: 29.3,
      localHumidity: 57
    });
  });

  it("marks all generated evidence as prototype simulation", () => {
    const result = simulateSensorWindow(scenario);

    expect(result.simulation).toBe(true);
    expect(result.evidenceLabel).toBe("Prototype Simulation");
  });

  it("rejects invalid scenario timing", () => {
    expect(() => simulateSensorWindow({ ...scenario, sampleCount: 1 }))
      .toThrow("at least two samples");
    expect(() => simulateSensorWindow({ ...scenario, intervalMinutes: 0 }))
      .toThrow("positive interval");
  });
});
