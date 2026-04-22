export type ExpoPackId = 'pack1' | 'pack2' | 'pack3';

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
    id: 'pack1',
    name: 'Pack Esencial',
    lisos: 4,
    estampados: 4,
    wetbag: 0,
    priceOriginal: 3614,
    priceDiscounted: 3324,
    color: 'green',
  },
  {
    id: 'pack2',
    name: 'Pack Inteligente',
    lisos: 5,
    estampados: 10,
    wetbag: 1,
    priceOriginal: 6720,
    priceDiscounted: 6048,
    color: 'purple',
  },
  {
    id: 'pack3',
    name: 'Pack Libertad',
    lisos: 8,
    estampados: 12,
    wetbag: 1,
    priceOriginal: 8737,
    priceDiscounted: 7689,
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

/** Key for sessionStorage to restore pack selection (e.g. when editing from cart) */
export const PACK_SELECTION_STORAGE_KEY = (packId: string) => `ecopipo_pack_${packId}_selection`;
