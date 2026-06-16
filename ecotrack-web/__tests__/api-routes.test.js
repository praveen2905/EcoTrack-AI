import { describe, it, expect, beforeEach } from "vitest";
import { GET as getChallengesRoute } from "@/app/api/challenges/route";
import { GET as getAssessmentsRoute, POST as createAssessmentRoute } from "@/app/api/assessments/route";
import { getChallenges } from "@/lib/store";

describe("API Routes", () => {
  beforeEach(() => {
    // Trigger initialization
    getChallenges();
    
    // Mutate the active reference directly rather than overriding globalThis
    const store = globalThis.__ecotrackStore;
    if (store) {
      store.assessments.length = 0;
      store.challenges.length = 0;
      store.challenges.push(
        { id: 1, title: "Challenge 1", completed: false },
      );
      store.nextAssessmentId = 1;
    }
  });

  it("should retrieve challenges via GET", async () => {
    const res = await getChallengesRoute();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Challenge 1");
  });

  it("should block invalid assessments with 400", async () => {
    const req = new Request("http://localhost/api/assessments", {
      method: "POST",
      body: JSON.stringify({
        transportKm: -10, // Invalid: must be >= 0
      }),
    });

    const res = await createAssessmentRoute(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.transportKm).toBeDefined();
  });

  it("should process valid assessments with 201", async () => {
    const req = new Request("http://localhost/api/assessments", {
      method: "POST",
      body: JSON.stringify({
        transportKm: 50,
        usesPublicTransport: true,
        flightsPerYear: 0,
        acHoursPerDay: 0,
        fanHoursPerDay: 0,
        monthlyElectricityBill: 0,
        isVegetarian: true,
        foodDeliveryPerWeek: 0,
        onlineOrdersPerMonth: 0,
      }),
    });

    const res = await createAssessmentRoute(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.id).toBe(1);
    expect(data.totalEmissions).toBeDefined();
  });
});
