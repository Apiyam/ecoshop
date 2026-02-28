'use client'
import { Suspense } from 'react'
import { ProductProvider } from '@/context/ProductContext'
import MainView from '../_components/MainView'
import { useParams } from 'next/navigation'
import LoadingIndicator from '@/components/LoadingIndicator'

function ProductPageContent() {
  const params = useParams()
  const product = params?.product
  return (
    <MainView selectedProduct={product ? `${product}` : undefined} />
  )
}

export default function ProductPage() {
  return (
    <ProductProvider>
      <Suspense fallback={<LoadingIndicator isFullScreen />}>
        <ProductPageContent />
      </Suspense>
    </ProductProvider>
  )
}