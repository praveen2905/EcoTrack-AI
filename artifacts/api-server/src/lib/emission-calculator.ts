export interface EmissionInputs {
  transportKm: number;
  usesPublicTransport: boolean;
  flightsPerYear: number;
  acHoursPerDay: number;
  fanHoursPerDay: number;
  monthlyElectricityBill: number;
  isVegetarian: boolean;
  foodDeliveryPerWeek: number;
  onlineOrdersPerMonth: number;
}

export interface EmissionResults {
  transportEmissions: number;
  electricityEmissions: number;
  foodEmissions: number;
  shoppingEmissions: number;
  totalEmissions: number;
  carbonScore: number;
}

const AVG_MONTHLY_EMISSIONS_KG = 200;

export function calculateEmissions(data: EmissionInputs): EmissionResults {
  const transportFactor = data.usesPublicTransport ? 0.05 : 0.21;
  const transportEmissions =
    data.transportKm * 30 * transportFactor + data.flightsPerYear * 90;

  const electricityEmissions =
    data.acHoursPerDay * 0.8 * 30 +
    data.fanHoursPerDay * 0.075 * 30 +
    data.monthlyElectricityBill * 0.85;

  const foodEmissions = data.isVegetarian
    ? 10 + data.foodDeliveryPerWeek * 1.2 * 4
    : 22 + data.foodDeliveryPerWeek * 2.5 * 4;

  const shoppingEmissions = data.onlineOrdersPerMonth * 3.5;

  const totalEmissions =
    transportEmissions + electricityEmissions + foodEmissions + shoppingEmissions;

  const carbonScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - (totalEmissions / AVG_MONTHLY_EMISSIONS_KG) * 50)
    )
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
