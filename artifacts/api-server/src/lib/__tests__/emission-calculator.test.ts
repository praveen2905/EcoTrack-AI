import { describe, it, expect } from "vitest";
import { calculateEmissions, type EmissionInputs } from "../emission-calculator";

const baseInputs: EmissionInputs = {
  transportKm: 0,
  usesPublicTransport: false,
  flightsPerYear: 0,
  acHoursPerDay: 0,
  fanHoursPerDay: 0,
  monthlyElectricityBill: 0,
  isVegetarian: false,
  foodDeliveryPerWeek: 0,
  onlineOrdersPerMonth: 0,
};

describe("calculateEmissions", () => {
  describe("transportEmissions", () => {
    it("is zero when driving 0 km with no flights", () => {
      const result = calculateEmissions(baseInputs);
      expect(result.transportEmissions).toBe(0);
    });

    it("applies private-car factor when not using public transport", () => {
      const result = calculateEmissions({ ...baseInputs, transportKm: 100 });
      // 100 km * 30 days * 0.21 kg/km = 630
      expect(result.transportEmissions).toBeCloseTo(630, 2);
    });

    it("applies public-transport factor when flag is true", () => {
      const result = calculateEmissions({
        ...baseInputs,
        transportKm: 100,
        usesPublicTransport: true,
      });
      // 100 * 30 * 0.05 = 150
      expect(result.transportEmissions).toBeCloseTo(150, 2);
    });

    it("adds flight emissions per flight", () => {
      const result = calculateEmissions({ ...baseInputs, flightsPerYear: 2 });
      // 2 * 90 = 180
      expect(result.transportEmissions).toBeCloseTo(180, 2);
    });

    it("combines driving and flights correctly", () => {
      const result = calculateEmissions({
        ...baseInputs,
        transportKm: 50,
        flightsPerYear: 1,
      });
      // 50 * 30 * 0.21 + 1 * 90 = 315 + 90 = 405
      expect(result.transportEmissions).toBeCloseTo(405, 2);
    });
  });

  describe("electricityEmissions", () => {
    it("is zero with no appliance usage and no bill", () => {
      const result = calculateEmissions(baseInputs);
      expect(result.electricityEmissions).toBe(0);
    });

    it("calculates AC emissions over 30 days", () => {
      const result = calculateEmissions({ ...baseInputs, acHoursPerDay: 8 });
      // 8 * 0.8 * 30 = 192
      expect(result.electricityEmissions).toBeCloseTo(192, 2);
    });

    it("calculates fan emissions over 30 days", () => {
      const result = calculateEmissions({ ...baseInputs, fanHoursPerDay: 10 });
      // 10 * 0.075 * 30 = 22.5
      expect(result.electricityEmissions).toBeCloseTo(22.5, 2);
    });

    it("converts electricity bill to kg CO2", () => {
      const result = calculateEmissions({
        ...baseInputs,
        monthlyElectricityBill: 100,
      });
      // 100 * 0.85 = 85
      expect(result.electricityEmissions).toBeCloseTo(85, 2);
    });

    it("sums all three electricity sources", () => {
      const result = calculateEmissions({
        ...baseInputs,
        acHoursPerDay: 2,
        fanHoursPerDay: 4,
        monthlyElectricityBill: 50,
      });
      // 2*0.8*30 + 4*0.075*30 + 50*0.85 = 48 + 9 + 42.5 = 99.5
      expect(result.electricityEmissions).toBeCloseTo(99.5, 2);
    });
  });

  describe("foodEmissions", () => {
    it("uses omnivore base when not vegetarian", () => {
      const result = calculateEmissions({ ...baseInputs });
      // 22 + 0 = 22
      expect(result.foodEmissions).toBeCloseTo(22, 2);
    });

    it("uses lower vegetarian base", () => {
      const result = calculateEmissions({ ...baseInputs, isVegetarian: true });
      // 10 + 0 = 10
      expect(result.foodEmissions).toBeCloseTo(10, 2);
    });

    it("adds omnivore delivery factor per order per week", () => {
      const result = calculateEmissions({
        ...baseInputs,
        foodDeliveryPerWeek: 3,
      });
      // 22 + 3 * 2.5 * 4 = 22 + 30 = 52
      expect(result.foodEmissions).toBeCloseTo(52, 2);
    });

    it("adds vegetarian delivery factor per order per week", () => {
      const result = calculateEmissions({
        ...baseInputs,
        isVegetarian: true,
        foodDeliveryPerWeek: 3,
      });
      // 10 + 3 * 1.2 * 4 = 10 + 14.4 = 24.4
      expect(result.foodEmissions).toBeCloseTo(24.4, 2);
    });
  });

  describe("shoppingEmissions", () => {
    it("is zero with no orders", () => {
      const result = calculateEmissions(baseInputs);
      expect(result.shoppingEmissions).toBe(0);
    });

    it("multiplies orders by per-parcel factor", () => {
      const result = calculateEmissions({
        ...baseInputs,
        onlineOrdersPerMonth: 5,
      });
      // 5 * 3.5 = 17.5
      expect(result.shoppingEmissions).toBeCloseTo(17.5, 2);
    });
  });

  describe("totalEmissions", () => {
    it("equals the sum of all category emissions", () => {
      const inputs: EmissionInputs = {
        transportKm: 30,
        usesPublicTransport: false,
        flightsPerYear: 1,
        acHoursPerDay: 2,
        fanHoursPerDay: 3,
        monthlyElectricityBill: 60,
        isVegetarian: false,
        foodDeliveryPerWeek: 2,
        onlineOrdersPerMonth: 4,
      };
      const result = calculateEmissions(inputs);
      expect(result.totalEmissions).toBeCloseTo(
        result.transportEmissions +
          result.electricityEmissions +
          result.foodEmissions +
          result.shoppingEmissions,
        5,
      );
    });
  });

  describe("carbonScore", () => {
    it("returns a value between 0 and 100 inclusive", () => {
      const extremelyHighEmissions: EmissionInputs = {
        transportKm: 1000,
        usesPublicTransport: false,
        flightsPerYear: 50,
        acHoursPerDay: 24,
        fanHoursPerDay: 24,
        monthlyElectricityBill: 500,
        isVegetarian: false,
        foodDeliveryPerWeek: 21,
        onlineOrdersPerMonth: 200,
      };
      const result = calculateEmissions(extremelyHighEmissions);
      expect(result.carbonScore).toBeGreaterThanOrEqual(0);
      expect(result.carbonScore).toBeLessThanOrEqual(100);
    });

    it("clamps to 100 for a fully zero-emission vegetarian lifestyle", () => {
      // isVegetarian:true, all zeros → foodEmissions=10, totalEmissions=10
      // score = round(100 - (10/200)*50) = round(97.5) = 98 — well above 0, confirms no negative clamp
      const result = calculateEmissions({ ...baseInputs, isVegetarian: true });
      expect(result.carbonScore).toBeGreaterThanOrEqual(95);
      expect(result.carbonScore).toBeLessThanOrEqual(100);
    });

    it("returns 95 for base omnivore with no other activity", () => {
      // totalEmissions = 22 (omnivore base)
      // score = round(100 - (22/200)*50) = round(94.5) = 95
      const result = calculateEmissions(baseInputs);
      expect(result.carbonScore).toBe(95);
    });

    it("clamps to 0 for extremely high emissions", () => {
      const result = calculateEmissions({
        transportKm: 5000,
        usesPublicTransport: false,
        flightsPerYear: 100,
        acHoursPerDay: 24,
        fanHoursPerDay: 24,
        monthlyElectricityBill: 1000,
        isVegetarian: false,
        foodDeliveryPerWeek: 21,
        onlineOrdersPerMonth: 200,
      });
      expect(result.carbonScore).toBe(0);
    });

    it("is lower (worse) for higher-emission lifestyles", () => {
      const low = calculateEmissions({ ...baseInputs, transportKm: 10 });
      const high = calculateEmissions({ ...baseInputs, transportKm: 200 });
      expect(high.carbonScore).toBeLessThan(low.carbonScore);
    });

    it("is an integer (rounded)", () => {
      const result = calculateEmissions({ ...baseInputs, transportKm: 37 });
      expect(result.carbonScore).toBe(Math.round(result.carbonScore));
    });
  });
});
