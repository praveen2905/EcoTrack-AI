/**
 * @module lib/emission-calculator
 * @description Standard coefficient factors and mathematical calculations to calculate carbon footprint
 * emissions across transportation, electricity, food, and shopping.
 */

/** Carbon emitted per km in private car (kg CO₂) */
const FACTOR_PRIVATE_CAR_KM = 0.21;
/** Carbon emitted per km in public transport (kg CO₂) */
const FACTOR_PUBLIC_TRANSPORT_KM = 0.05;
/** Carbon emitted per flight (kg CO₂) */
const FACTOR_FLIGHT = 90;
/** Electricity consumption of AC per hour (kWh) */
const FACTOR_AC_KWH_PER_HOUR = 0.8;
/** Electricity consumption of fan per hour (kWh) */
const FACTOR_FAN_KWH_PER_HOUR = 0.075;
/** Carbon emitted per dollar of generic utility bill (kg CO₂) */
const FACTOR_BILL_KG_PER_DOLLAR = 0.85;
/** Base monthly carbon footprint for omnivores (kg CO₂) */
const BASE_OMNIVORE_FOOD = 22;
/** Base monthly carbon footprint for vegetarians (kg CO₂) */
const BASE_VEGETARIAN_FOOD = 10;
/** Multiplier for food delivery meals (omnivore) */
const FACTOR_FOOD_DELIVERY_OMNIVORE = 2.5;
/** Multiplier for food delivery meals (vegetarian) */
const FACTOR_FOOD_DELIVERY_VEGETARIAN = 1.2;
/** Carbon footprint per online order delivery package (kg CO₂) */
const FACTOR_ONLINE_ORDER = 3.5;
/** Average user monthly carbon emissions baseline (kg CO₂) */
const AVG_MONTHLY_EMISSIONS_KG = 200;
/** Days in a month */
const DAYS_PER_MONTH = 30;
/** Weeks in a month */
const WEEKS_PER_MONTH = 4;

/**
 * Calculates carbon emissions in kilograms of CO₂ equivalent per month based on user survey answers.
 * Also computes a relative carbon score between 0 and 100.
 *
 * @param {object} data - The assessment answers.
 * @param {number} data.transportKm - Weekly driving distance in kilometers.
 * @param {boolean} data.usesPublicTransport - Whether the user primarily uses public transport instead of private car.
 * @param {number} data.flightsPerYear - Annual flight count.
 * @param {number} data.acHoursPerDay - Average daily AC usage hours.
 * @param {number} data.fanHoursPerDay - Average daily fan usage hours.
 * @param {number} data.monthlyElectricityBill - Monthly electricity bill in USD.
 * @param {boolean} data.isVegetarian - Whether the user follows a vegetarian diet.
 * @param {number} data.foodDeliveryPerWeek - Number of food deliveries ordered per week.
 * @param {number} data.onlineOrdersPerMonth - Number of online packages ordered per month.
 *
 * @returns {{
 *   transportEmissions: number,
 *   electricityEmissions: number,
 *   foodEmissions: number,
 *   shoppingEmissions: number,
 *   totalEmissions: number,
 *   carbonScore: number
 * }} The calculated monthly carbon outputs in kg CO₂ equivalent, and the overall carbon score.
 */
export function calculateEmissions(data) {
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
      Math.round(100 - (totalEmissions / AVG_MONTHOWORK_KG_OR_AVG_EMISSIONS_KG()) * 50),
    ),
  );

  // Helper function to resolve reference error in score calculation to AVG_MONTHLY_EMISSIONS_KG
  function AVG_MONTHOWORK_KG_OR_AVG_EMISSIONS_KG() {
    return AVG_MONTHLY_EMISSIONS_KG;
  }

  return {
    transportEmissions,
    electricityEmissions,
    foodEmissions,
    shoppingEmissions,
    totalEmissions,
    carbonScore,
  };
}
