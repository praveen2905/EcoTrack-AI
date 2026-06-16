import { describe, it, expect } from "vitest";
import { calculateEmissions } from "@/lib/emission-calculator";

describe("emission-calculator", () => {
  it("should calculate correct emissions for omnivore driver", () => {
    const input = {
      transportKm: 100,
      usesPublicTransport: false,
      flightsPerYear: 2,
      acHoursPerDay: 5,
      fanHoursPerDay: 10,
      monthlyElectricityBill: 50,
      isVegetarian: false,
      foodDeliveryPerWeek: 3,
      onlineOrdersPerMonth: 10,
    };

    const result = calculateEmissions(input);

    expect(result.transportEmissions).toBeCloseTo(100 * 30 * 0.21 + 2 * 90);
    expect(result.electricityEmissions).toBeCloseTo(5 * 0.8 * 30 + 10 * 0.075 * 30 + 50 * 0.85);
    expect(result.foodEmissions).toBeCloseTo(22 + 3 * 2.5 * 4);
    expect(result.shoppingEmissions).toBeCloseTo(10 * 3.5);
    expect(result.totalEmissions).toBeGreaterThan(0);
    expect(result.carbonScore).toBeGreaterThanOrEqual(0);
    expect(result.carbonScore).toBeLessThanOrEqual(100);
  });

  it("should calculate correct emissions for vegetarian commuter", () => {
    const input = {
      transportKm: 50,
      usesPublicTransport: true,
      flightsPerYear: 0,
      acHoursPerDay: 0,
      fanHoursPerDay: 0,
      monthlyElectricityBill: 0,
      isVegetarian: true,
      foodDeliveryPerWeek: 0,
      onlineOrdersPerMonth: 0,
    };

    const result = calculateEmissions(input);

    expect(result.transportEmissions).toBeCloseTo(50 * 30 * 0.05 + 0);
    expect(result.electricityEmissions).toBe(0);
    expect(result.foodEmissions).toBe(10); // base vegetarian food
    expect(result.shoppingEmissions).toBe(0);
    expect(result.carbonScore).toBe(79); // 100 - (85 / 200) * 50 = 78.75 -> rounded to 79
  });

  it("should cap carbon score between 0 and 100", () => {
    // Ultra high emissions input to test the floor boundary
    const extremeInput = {
      transportKm: 10000,
      usesPublicTransport: false,
      flightsPerYear: 100,
      acHoursPerDay: 24,
      fanHoursPerDay: 24,
      monthlyElectricityBill: 5000,
      isVegetarian: false,
      foodDeliveryPerWeek: 21,
      onlineOrdersPerMonth: 200,
    };

    const result = calculateEmissions(extremeInput);
    expect(result.carbonScore).toBe(0);
  });
});
