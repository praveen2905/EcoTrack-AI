import { Router, type IRouter } from "express";

const router: IRouter = Router();

const TIPS = [
  { id: 1, tip: "Turn off lights when you leave a room — it only takes a second but saves hours of energy.", category: "Electricity", carbonImpact: "Saves ~0.5 kg CO2/month" },
  { id: 2, tip: "Carry a reusable water bottle and coffee cup to eliminate single-use plastics.", category: "Shopping", carbonImpact: "Saves ~1.2 kg CO2/month" },
  { id: 3, tip: "Try a plant-based meal today — even one meatless meal per week makes a measurable difference.", category: "Food", carbonImpact: "Saves ~2.1 kg CO2/week" },
  { id: 4, tip: "Walk or cycle for trips under 2 km instead of driving.", category: "Transport", carbonImpact: "Saves ~3.0 kg CO2/trip" },
  { id: 5, tip: "Lower your water heater to 120°F — you will not notice the difference, but your bill will.", category: "Electricity", carbonImpact: "Saves ~5.0 kg CO2/month" },
  { id: 6, tip: "Consolidate errands into a single trip to minimize driving distance.", category: "Transport", carbonImpact: "Saves ~2.5 kg CO2/week" },
  { id: 7, tip: "Air-dry your laundry when possible instead of using a dryer.", category: "Electricity", carbonImpact: "Saves ~3.0 kg CO2/month" },
];

router.get("/tips/daily", (_req, res): void => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const tip = TIPS[dayOfYear % TIPS.length];
  res.json(tip);
});

export default router;
