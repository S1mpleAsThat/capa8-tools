// src/services/subscription/subscriptionConfig.js

export const IS_PRO = false;

export const PLAN_FREE = "free";
export const PLAN_PRO = "pro";

export function getCurrentPlan() {
  return IS_PRO ? PLAN_PRO : PLAN_FREE;
}

export function isProUser() {
  return getCurrentPlan() === PLAN_PRO;
}