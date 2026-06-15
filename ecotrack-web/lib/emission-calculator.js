const FACTOR_PRIVATE_CAR_KM = 0.21;
const FACTOR_PUBLIC_TRANSPORT_KM = 0.05;
const FACTOR_FLIGHT = 90;
const FACTOR_AC_KWH_PER_HOUR = 0.8;
const FACTOR_FAN_KWH_PER_HOUR = 0.075;
const FACTOR_BILL_KG_PER_DOLLAR = 0.85;
const BASE_OMNIVORE_FOOD = 22;
const BASE_VEGETARIAN_FOOD = 10;
const FACTOR_FOOD_DELIVERY_OMNIVORE = 2.5;
const FACTOR_FOOD_DELIVERY_VEGETARIAN = 1.2;
const FACTOR_ONLINE_ORDER = 3.5;
const AVG_MONTHLY_EMISSIONS_KG = 200;
const DAYS_PER_MONTH = 30;
const WEEKS_PER_MONTH = 4;

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
