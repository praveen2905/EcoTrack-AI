import { INITIAL_CHALLENGES } from "./mock-data";

const globalStore = globalThis.__ecotrackStore ?? {
  assessments: [],
  challenges: [...INITIAL_CHALLENGES.map((c) => ({ ...c }))],
  nextAssessmentId: 1,
};

globalThis.__ecotrackStore = globalStore;

export function getAssessments() {
  return globalStore.assessments;
}

export function getAssessmentById(id) {
  return globalStore.assessments.find((a) => a.id === id) ?? null;
}

export function createAssessment(input, emissions) {
  const assessment = {
    id: globalStore.nextAssessmentId++,
    ...input,
    ...emissions,
    createdAt: new Date().toISOString(),
  };
  globalStore.assessments.unshift(assessment);
  return assessment;
}

export function getChallenges() {
  return globalStore.challenges;
}

export function completeChallenge(id) {
  const challenge = globalStore.challenges.find((c) => c.id === id);
  if (!challenge) return null;
  challenge.completed = true;
  return challenge;
}

export function getCompletedChallengeCount() {
  return globalStore.challenges.filter((c) => c.completed).length;
}
