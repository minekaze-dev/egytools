import { TIERS } from '../constants/tier';
import { TierDefinition, TierProgress } from '../types/customer';

/**
 * Determines current tier based on active closing count (SA) AND active monthly net revenue.
 * Both conditions MUST be met to reach a tier level.
 */
export const getCurrentTier = (
  activeClosing: number,
  activeRevenue: number
): TierDefinition => {
  // Check from highest tier to lowest tier
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const tier = TIERS[i];
    if (activeClosing >= tier.minClosing && activeRevenue >= tier.minRevenue) {
      return tier;
    }
  }
  return TIERS[0]; // Tier 0 default
};

/**
 * Calculates progress towards current tier and next tier.
 */
export const getTierProgress = (
  activeClosing: number,
  activeRevenue: number
): TierProgress => {
  const currentTier = getCurrentTier(activeClosing, activeRevenue);
  const isMaxTier = currentTier.level === TIERS.length - 1;
  const nextTier = isMaxTier ? null : TIERS[currentTier.level + 1];

  let closingNeeded = 0;
  let revenueNeeded = 0;
  let closingProgressPercent = 100;
  let revenueProgressPercent = 100;

  if (nextTier) {
    closingNeeded = Math.max(0, nextTier.minClosing - activeClosing);
    revenueNeeded = Math.max(0, nextTier.minRevenue - activeRevenue);

    const prevMinClosing = currentTier.minClosing;
    const prevMinRevenue = currentTier.minRevenue;

    const closingRange = nextTier.minClosing - prevMinClosing;
    const revenueRange = nextTier.minRevenue - prevMinRevenue;

    closingProgressPercent = Math.min(
      100,
      Math.max(
        0,
        ((activeClosing - prevMinClosing) / (closingRange || 1)) * 100
      )
    );

    revenueProgressPercent = Math.min(
      100,
      Math.max(
        0,
        ((activeRevenue - prevMinRevenue) / (revenueRange || 1)) * 100
      )
    );
  }

  return {
    currentTier,
    nextTier,
    activeClosing,
    activeRevenue,
    closingNeeded,
    revenueNeeded,
    closingProgressPercent,
    revenueProgressPercent,
    isMaxTier,
  };
};
