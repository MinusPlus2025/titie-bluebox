import { describe, expect, it } from "vitest";

import { extractZoneFeatures } from "../src/engine/feature-extractor.js";
import type { ZoneSensorWindow } from "../src/domain/thermal.js";

const window: ZoneSensorWindow = {
  zone: "knee_leg",
  simulation: true,
  evidenceLabel: "Prototype Simulation",
  samples: [
    {
      timestamp: "2026-08-28T22:00:00.000Z",
      localSkinTemp: 33.2,
      contactTemp: 29.4,
      localMicroclimateTemp: 28.7,
      localHumidity: 54,
      bodyAverageSkinTemp: 33.5,
      contactState: "CONTACT",
      movement: 0.1
    },
    {
      timestamp: "2026-08-28T22:05:00.000Z",
      localSkinTemp: 32.7,
      contactTemp: 29.2,
      localMicroclimateTemp: 28.6,
      localHumidity: 56,
      bodyAverageSkinTemp: 33.4,
      contactState: "CONTACT",
      movement: 0.2
    }
  ]
};

describe("extractZoneFeatures", () => {
  it("uses elapsed minutes to derive current values and temperature slopes", () => {
    const features = extractZoneFeatures(window);

    expect(features).toEqual({
      localSkinTemp: 32.7,
      contactTemp: 29.2,
      localMicroclimateTemp: 28.6,
      localHumidity: 56,
      skinTempSlopePerMinute: -0.1,
      contactTempSlopePerMinute: -0.04,
      humiditySlopePerMinute: 0.4,
      zoneToBodyDelta: -0.7,
      sampleCount: 2,
      durationMinutes: 5
    });
  });

  it("rejects a window with fewer than two samples", () => {
    expect(() => extractZoneFeatures({ ...window, samples: window.samples.slice(0, 1) }))
      .toThrow("at least two sensor samples");
  });

  it("rejects samples whose timestamps do not advance", () => {
    const duplicateTime = { ...window.samples[1]!, timestamp: window.samples[0]!.timestamp };
    expect(() => extractZoneFeatures({ ...window, samples: [window.samples[0]!, duplicateTime] }))
      .toThrow("strictly increasing timestamps");
  });
});
