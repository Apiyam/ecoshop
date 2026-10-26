import { ProductItem } from './wooApi'

/** Ya no hay descuentos fijos por producto (pañoletas, panties, etc.). */
export function checkDiscount(_product: ProductItem): number {
  return 0
}
