import { TierDefinition } from '../types/customer';

export const TIERS: TierDefinition[] = [
  {
    level: 0,
    name: 'Tier 0',
    minClosing: 0,
    minRevenue: 0,
    inc1Percent: 0,
  },
  {
    level: 1,
    name: 'Tier 1',
    minClosing: 15,
    minRevenue: 3750000,
    inc1Percent: 25,
  },
  {
    level: 2,
    name: 'Tier 2',
    minClosing: 18,
    minRevenue: 4500000,
    inc1Percent: 30,
  },
  {
    level: 3,
    name: 'Tier 3',
    minClosing: 22,
    minRevenue: 5500000,
    inc1Percent: 35,
  },
];
