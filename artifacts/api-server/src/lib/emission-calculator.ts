/**
 * Emission factor constants.
 * Sources: IPCC AR6, IEA 2023, EPA GHG equivalencies.
 */

/** kg CO₂e per km driven (private car, petrol) */
const FACTOR_PRIVATE_CAR_KM = 0.21;
/** kg CO₂e per km driven (bus/rail average) */
const FACTOR_PUBLIC_TRANSPORT_KM = 0.05;
/** kg CO₂e per flight (average short-haul, economy) */
const FACTOR_FLIGHT = 90;
/** kg CO₂e per kWh of average grid electricity */
const FACTOR_AC_KWH_PER_HOUR = 0.8;
/** kg CO₂e per kWh for a ceiling fan */
const FACTOR_FAN_KWH_PER_HOUR = 0.075;
/** kg CO₂e per $ of electricity bill (proxy for kWh) */
const FACTOR_BILL_KG_PER_DOLLAR = 0.85;
/** kg CO₂e/month baseline for omnivore diet */
const BASE_OMNIVORE_FOOD = 22;
/** kg CO₂e/month baseline for vegetarian diet */
const BASE_VEGETARIAN_FOOD = 10;
/** kg CO₂e per food-delivery order (packaging + transit) */
const FACTOR_FOOD_DELIVERY_OMNIVORE = 2.5;
/** kg CO₂e per food-delivery order (plant-based menu) */
const FACTOR_FOOD_DELIVERY_VEGETARIAN = 1.2;
/** kg CO₂e per online retail parcel (packaging + last-mile) */
const FACTOR_ONLINE_ORDER = 3.5;

/** Average monthly carbon footprint used to normalise the score (kg CO₂e). */
const AVG_MONTHLY_EMISSIONS_KG = 200;

/** Days in the month used for daily→monthly conversions. */
const DAYS_PER_MONTH = 30;
/** Weeks in the month used for weekly→monthly conversions. */
const WEEKS_PER_MONTH = 4;

export interface EmissionInputs {
  /** Weekly driving distance in km. */
  transportKm: number;
  /** Whether the user regularly uses public transport. */
  usesPublicTransport: boolean;
  /** Number of flights taken per year. */
  flightsPerYear: number;
  /** Air-conditioning usage in hours per day. */
  acHoursPerDay: number;
  /** Fan usage in hours per day. */
  fanHoursPerDay: number;
  /** Average monthly electricity bill in USD. */
  monthlyElectricityBill: number;
  /** Whether the user follows a primarily vegetarian diet. */
  isVegetarian: boolean;
  /** Number of food-delivery orders per week. */
  foodDeliveryPerWeek: number;
  /** Number of online retail orders per month. */
  onlineOrdersPerMonth: number;
}

export interface EmissionResults {
  /** Monthly transport emissions in kg CO₂e. */
  transportEmissions: number;
  /** Monthly electricity-related emissions in kg CO₂e. */
  electricityEmissions: number;
  /** Monthly food-related emissions in kg CO₂e. */
  foodEmissions: number;
  /** Monthly shopping-related emissions in kg CO₂e. */
  shoppingEmissions: number;
  /** Total monthly emissions in kg CO₂e. */
  totalEmissions: number;
  /**
   * A 0–100 carbon score where higher is better (lower footprint).
   * Scored relative to {@link AVG_MONTHLY_EMISSIONS_KG}.
   */
  carbonScore: number;
}

/**
 * Calculate estimated monthly carbon emissions from lifestyle inputs.
 *
 * All intermediate values are in kg CO₂ equivalent (CO₂e) per month.
 *
 * @param data - User-provided lifestyle data from the assessment wizard.
 * @returns Breakdown and total monthly emissions plus a relative carbon score.
 *
 * @example
 * ```ts
 * const result = calculateEmissions({
 *   transportKm: 50, usesPublicTransport: false, flightsPerYear: 2,
 *   acHoursPerDay: 4, fanHoursPerDay: 2, monthlyElectricityBill: 60,
 *   isVegetarian: true, foodDeliveryPerWeek: 1, onlineOrdersPerMonth: 3,
 * });
 * console.log(result.carbonScore); // 0–100
 * ```
 */
export function calculateEmissions(data: EmissionInputs): EmissionResults {
  const transportFactor = data.usesPublicTransport
    ? FACTOR_PUBLIC_TRANSPORT_KM
    : FACTOR_PRIVATE_CAR_KM;

  const transportEmissions =
    data.transportKm * DAYS_PER_MONTH * transportFactor +
    data.flightsPerYear * FACTOR_FLIGHT;

  const electricityEmissions =
    data.acHoursPerDay * FACTOR_AC_KWH_PER_HOUR * DAYS_PER_MONTH +
    data.fanHoursPerDay * FACTOR_FAN_KWH_PER_HOUR * DAYS_PER_MONTH +
    data.monthlyElectricityBill * FACTOR_BILL_KG_PER_DOLLAR;

  const deliveryFactor = data.isVegetarian
    ? FACTOR_FOOD_DELIVERY_VEGETARIAN
    : FACTOR_FOOD_DELIVERY_OMNIVORE;
  const baseFood = data.isVegetarian ? BASE_VEGETARIAN_FOOD : BASE_OMNIVORE_FOOD;
  const foodEmissions =
    baseFood + data.foodDeliveryPerWeek * deliveryFactor * WEEKS_PER_MONTH;

  const shoppingEmissions = data.onlineOrdersPerMonth * FACTOR_ONLINE_ORDER;

  const totalEmissions =
    transportEmissions + electricityEmissions + foodEmissions + shoppingEmissions;

  const carbonScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - (totalEmissions / AVG_MONTHLY_EMISSIONS_KG) * 50),
    ),
  );

  return {
    transportEmissions,
    electricityEmissions,
    foodEmissions,
    shoppingEmissions,
    totalEmissions,
    carbonScore,
  };
}
