'use client'

import { useRouter } from 'next/navigation'
import { Container } from '@mui/joy'
import CartContent from '@/components/CartContent'

export default function CarritoPage() {
  const router = useRouter()
  return (
    <Container sx={{ py: 3, pb: 6 }}>
      <CartContent onClose={() => router.push('/tienda')} />
    </Container>
  )
}
