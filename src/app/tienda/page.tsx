'use client'
import { Suspense } from 'react'
import { ProductProvider } from '@/context/ProductContext'
import MainView from './_components/MainView'
import LoadingIndicator from '@/components/LoadingIndicator'

export default function ProductsPage() {
  return (
    <ProductProvider>
      <Suspense fallback={<LoadingIndicator isFullScreen />}>
        <MainView />
      </Suspense>
    </ProductProvider>
  )
}