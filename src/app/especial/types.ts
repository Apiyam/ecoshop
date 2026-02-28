export type ExpoPackId = 'inteligente' | 'tranquilidad' | 'libertad';

export type ExpoPack = {
  id: ExpoPackId;
  name: string;
  lisos: number;
  estampados: number;
  wetbag: number;
  priceOriginal: number;
  priceDiscounted: number;
  /** Color key for UI: green, purple */
  color: 'green' | 'purple';
};

export const PACKS: ExpoPack[] = [
  {
    id: 'inteligente',
    name: 'Pack Inteligente',
    lisos: 4,
    estampados: 4,
    wetbag: 0,
    priceOriginal: 3614,
    priceDiscounted: 3200,
    color: 'green',
  },
  {
    id: 'tranquilidad',
    name: 'Pack Tranquilidad',
    lisos: 5,
    estampados: 10,
    wetbag: 1,
    priceOriginal: 6720,
    priceDiscounted: 5670,
    color: 'purple',
  },
  {
    id: 'libertad',
    name: 'Pack Libertad',
    lisos: 8,
    estampados: 12,
    wetbag: 1,
    priceOriginal: 8737,
    priceDiscounted: 7190,
    color: 'purple',
  },
];

/** Parent IDs from categories for filtering webhook products */
export const PARENT_IDS = {
  LISOS: 5743,
  ESTAMPADOS: 6031,
  WETBAG: 3882,
  FILTRO_BAMBU: 4722,
  DETERGENTE: 3846,
} as const;

export const WEBHOOK_URL = 'https://n8n.srv912585.hstgr.cloud/webhook/lubella';
