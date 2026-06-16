/**
 * @module lib/store
 * @description In-memory global store to hold assessment entries and eco challenges progress.
 * Attaches the store to the `globalThis` context to prevent hot module reloading (HMR) from
 * clearing user progress during development builds.
 */

import { INITIAL_CHALLENGES } from "./mock-data";

/**
 * Global store interface container.
 * @type {{ assessments: Array<object>, challenges: Array<object>, nextAssessmentId: number }}
 */
const globalStore = globalThis.__ecotrackStore ?? {
  assessments: [],
  challenges: [...INITIAL_CHALLENGES.map((c) => ({ ...c }))],
  nextAssessmentId: 1,
};

globalThis.__ecotrackStore = globalStore;

/**
 * Retrieves all stored carbon assessments.
 *
 * @returns {Array<object>} List of carbon assessment records.
 */
export function getAssessments() {
  return globalStore.assessments;
}

/**
 * Retrieves a single assessment record by its numeric ID.
 *
 * @param {number} id - Numeric ID of the target assessment.
 * @returns {object|null} The assessment record or null if not found.
 */
export function getAssessmentById(id) {
  return globalStore.assessments.find((a) => a.id === id) ?? null;
}

/**
 * Creates and stores a new assessment record.
 *
 * @param {object} input - Input values submitted by the user.
 * @param {object} emissions - Carbon calculation results.
 * @returns {object} The newly created assessment record.
 */
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

/**
 * Retrieves the full list of eco challenges.
 *
 * @returns {Array<object>} The challenges array.
 */
export function getChallenges() {
  return globalStore.challenges;
}

/**
 * Marks a specific challenge as completed.
 *
 * @param {number} id - Numeric ID of the challenge.
 * @returns {object|null} The modified challenge object or null if not found.
 */
export function completeChallenge(id) {
  const challenge = globalStore.challenges.find((c) => c.id === id);
  if (!challenge) return null;
  challenge.completed = true;
  return challenge;
}

/**
 * Counts the number of completed challenges.
 *
 * @returns {number} The count of completed challenges.
 */
export function getCompletedChallengeCount() {
  return globalStore.challenges.filter((c) => c.completed).length;
}
