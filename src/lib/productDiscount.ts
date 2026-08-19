import { ProductItem } from './wooApi'

export function checkDiscount(product: ProductItem): number {
  if (product.name.includes('Tanga')) return 50
  if (product.name.includes('Leggings')) return 0
  if (product.name.includes('Pañoleta')) return 0
  if (product.name.includes('Mochila')) return 0
  if (product.name.includes('Lonchera')) return 0
  return 0
}
