import { describe, it, expect, beforeEach } from "vitest";
import {
  getAssessments,
  createAssessment,
  getAssessmentById,
  getChallenges,
  completeChallenge,
  getCompletedChallengeCount,
} from "@/lib/store";

describe("data-store", () => {
  beforeEach(() => {
    // Trigger module initialization if not already done
    getAssessments();
    
    // Mutate the active reference directly rather than overriding globalThis
    const store = globalThis.__ecotrackStore;
    if (store) {
      store.assessments.length = 0;
      store.challenges.length = 0;
      store.challenges.push(
        { id: 1, title: "Challenge 1", completed: false },
        { id: 2, title: "Challenge 2", completed: false },
      );
      store.nextAssessmentId = 1;
    }
  });

  it("should initialize with empty assessments and base challenges", () => {
    expect(getAssessments()).toEqual([]);
    expect(getChallenges()).toHaveLength(2);
  });

  it("should create a new assessment with incremented IDs", () => {
    const input = { transportKm: 50 };
    const emissions = { totalEmissions: 120, carbonScore: 80 };

    const first = createAssessment(input, emissions);
    expect(first.id).toBe(1);
    expect(first.transportKm).toBe(50);
    expect(first.totalEmissions).toBe(120);
    expect(first.createdAt).toBeDefined();

    const second = createAssessment({ transportKm: 100 }, emissions);
    expect(second.id).toBe(2);

    expect(getAssessments()).toHaveLength(2);
    expect(getAssessments()[0].id).toBe(2); // unshifted (newest first)
  });

  it("should retrieve assessment by ID", () => {
    createAssessment({ transportKm: 50 }, { totalEmissions: 120 });
    const match = getAssessmentById(1);
    expect(match).not.toBeNull();
    expect(match.id).toBe(1);

    expect(getAssessmentById(999)).toBeNull();
  });

  it("should mark challenges as completed and compute count", () => {
    expect(getCompletedChallengeCount()).toBe(0);

    const completed = completeChallenge(1);
    expect(completed.completed).toBe(true);
    expect(getCompletedChallengeCount()).toBe(1);

    const nonExistent = completeChallenge(999);
    expect(nonExistent).toBeNull();
  });
});
