import { ISPPackage } from '../types/customer';

export const MASTER_PACKAGES: ISPPackage[] = [
  {
    id: 'pkg-50-a',
    name: 'Stream 50 Mbps',
    speed: '50 Mbps',
    price: 185000,
    category: 'Standard',
  },
  {
    id: 'pkg-50-b',
    name: 'Stream 50 Mbps (Reguler)',
    speed: '50 Mbps',
    price: 199000,
    category: 'Standard',
  },
  {
    id: 'pkg-75',
    name: 'Stream 75 Mbps (SMT)',
    speed: '75 Mbps',
    price: 297000,
    category: 'SMT',
  },
  {
    id: 'pkg-100-smt',
    name: 'Stream 100 Mbps (SMT)',
    speed: '100 Mbps',
    price: 350000,
    category: 'SMT',
  },
  {
    id: 'pkg-150-smt',
    name: 'Stream 150 Mbps (SMT)',
    speed: '150 Mbps',
    price: 450000,
    category: 'SMT',
  },
  {
    id: 'pkg-200-smt',
    name: 'Stream 200 Mbps (SMT)',
    speed: '200 Mbps',
    price: 540000,
    category: 'SMT',
  },
  {
    id: 'pkg-100',
    name: 'Stream 100 Mbps',
    speed: '100 Mbps',
    price: 242000,
    category: 'Standard',
  },
  {
    id: 'pkg-sports-200',
    name: 'Stream Sports 200 Mbps Promo',
    speed: '200 Mbps',
    price: 277500,
    category: 'Sports',
  },
  {
    id: 'pkg-150',
    name: 'Stream 150 Mbps',
    speed: '150 Mbps',
    price: 306000,
    category: 'Standard',
  },
  {
    id: 'pkg-200',
    name: 'Stream 200 Mbps',
    speed: '200 Mbps',
    price: 356000,
    category: 'Standard',
  },
  {
    id: 'pkg-tv-100',
    name: 'Stream Plus TV 100 Mbps',
    speed: '100 Mbps',
    price: 299000,
    category: 'Plus TV',
  },
  {
    id: 'pkg-tv-150',
    name: 'Stream Plus TV 150 Mbps',
    speed: '150 Mbps',
    price: 359000,
    category: 'Plus TV',
  },
  {
    id: 'pkg-tv-200',
    name: 'Stream Plus TV 200 Mbps',
    speed: '200 Mbps',
    price: 409000,
    category: 'Plus TV',
  },
  {
    id: 'pkg-oxylite-50',
    name: 'Oxylite 50',
    speed: '50 Mbps',
    price: 110000,
    category: 'Oxylite',
  },
  {
    id: 'pkg-oxylite-75',
    name: 'Oxylite 75',
    speed: '75 Mbps',
    price: 138750,
    category: 'Oxylite',
  },
  {
    id: 'pkg-oxylite-100',
    name: 'Oxylite 100',
    speed: '100 Mbps',
    price: 166500,
    category: 'Oxylite',
  },
];

export const getPackageById = (id: string): ISPPackage | undefined => {
  return MASTER_PACKAGES.find((pkg) => pkg.id === id);
};
