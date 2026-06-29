import { ProductItem } from './wooApi'

/** Categoría padre: trajes acuáticos (preventa con stock negativo) */
export const TRAJES_ACUATICOS_PARENT_ID = 32335

export function isPreventaProduct(product: ProductItem): boolean {
  return product.parent === TRAJES_ACUATICOS_PARENT_ID
}

export function isProductPurchasable(product: ProductItem): boolean {
  if (product.stock == null) return false
  return product.stock > 0 || isPreventaProduct(product)
}

/** Filtro lateral "En stock" / "Sin stock" */
export function matchesStockFilter(product: ProductItem, inStockOnly: boolean): boolean {
  if (isPreventaProduct(product)) return inStockOnly
  return inStockOnly ? product.stock > 0 : product.stock === 0
}

export function getEffectiveMaxQuantity(product: ProductItem): number {
  if (isPreventaProduct(product)) return 99
  return Math.max(0, product.stock ?? 0)
}
