import { ProductItem } from './wooApi'

export function checkDiscount(product: ProductItem): number {
  if (product.name.includes('Tanga')) return 50
  if (product.name.includes('Leggings')) return 70
  if (product.name.includes('Pañoleta')) return 70
  if (product.name.includes('Mochila')) return 40
  if (product.name.includes('Lonchera')) return 35
  return 0
}
