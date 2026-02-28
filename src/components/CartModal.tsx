'use client'

import { Modal, ModalDialog, ModalClose } from '@mui/joy'
import CartContent from './CartContent'

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 11000 }} disableScrollLock>
      <ModalDialog size="lg" sx={{ maxWidth: 1200, width: '98%', maxHeight: '90vh', overflow: 'auto' }}>
        <ModalClose />
        <CartContent onClose={onClose} />
      </ModalDialog>
    </Modal>
  )
}
