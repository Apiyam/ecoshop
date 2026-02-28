'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  Stack,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ProductItem } from '@/lib/wooApi';
import { useCart } from '@/context/CartContext';
import {
  ExpoPack,
  PACKS,
  PARENT_IDS,
  WEBHOOK_URL,
} from './types';
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER, BRAND_GREEN_HOVER } from '@/lib/constants';

const emptyProductItem = (p: Partial<ProductItem>): ProductItem => ({
  sku: p.sku ?? '',
  id: p.id ?? 0,
  parent: p.parent ?? 0,
  parent_name: p.parent_name ?? '',
  name: p.name ?? '',
  stock: p.stock ?? 0,
  description: p.description ?? '',
  cedis_universo: p.cedis_universo ?? '',
  cedis_galaxia: p.cedis_galaxia ?? '',
  cedis_constelacion: p.cedis_constelacion ?? '',
  cedis_sol: p.cedis_sol ?? '',
  mayorista_luna: p.mayorista_luna ?? '',
  mayorista_estrella: p.mayorista_estrella ?? '',
  minorista_nebulosa: p.minorista_nebulosa ?? '',
  promotora_cometa: p.promotora_cometa ?? '',
  sat: p.sat ?? '',
  public_price: p.public_price ?? '0',
  categories: p.categories ?? '',
  images: p.images ?? '',
});

type PackWizardProps = {
  pack: ExpoPack;
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
};

type StepIndex = 0 | 1 | 2 | 3;

export default function PackWizard({ pack, open, onClose, onComplete }: PackWizardProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepIndex>(0);
  const [selectedLisos, setSelectedLisos] = useState<ProductItem[]>([]);
  const [selectedEstampados, setSelectedEstampados] = useState<ProductItem[]>([]);
  const [selectedWetbag, setSelectedWetbag] = useState<ProductItem | null>(null);

  const hasWetbagStep = pack.wetbag > 0;
  const stepLabels = hasWetbagStep
    ? ['Elige tus lisos', 'Elige tus estampados', 'Elige tu bolsa impermeable', 'Resumen']
    : ['Elige tus lisos', 'Elige tus estampados', 'Resumen'];

  const lisosList = products.filter((p) => p.parent === PARENT_IDS.LISOS);
  const estampadosList = products.filter((p) => p.parent === PARENT_IDS.ESTAMPADOS);
  const wetbagList = products.filter((p) => p.parent === PARENT_IDS.WETBAG);
  const filtroProduct = products.find((p) => p.parent === PARENT_IDS.FILTRO_BAMBU || p.id === PARENT_IDS.FILTRO_BAMBU)
    ?? products.find((p) => p.id === PARENT_IDS.FILTRO_BAMBU);
  const detergenteProduct = products.find((p) => p.parent === PARENT_IDS.DETERGENTE || p.id === PARENT_IDS.DETERGENTE)
    ?? products.find((p) => p.id === PARENT_IDS.DETERGENTE);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setStep(0);
    setSelectedLisos([]);
    setSelectedEstampados([]);
    setSelectedWetbag(null);
    fetch(WEBHOOK_URL)
      .then((res) => res.json())
      .then((data: unknown) => {
        const raw = Array.isArray(data) ? data : [];
        const normalized = raw.map((p: Record<string, unknown>) =>
          emptyProductItem(p as Partial<ProductItem>)
        );
        setProducts(normalized);
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }, [open]);

  const canNext = useCallback(() => {
    if (step === 0) return selectedLisos.length === pack.lisos;
    if (step === 1) return selectedEstampados.length === pack.estampados;
    if (step === 2 && hasWetbagStep) return selectedWetbag != null;
    return true;
  }, [step, pack, selectedLisos.length, selectedEstampados.length, selectedWetbag, hasWetbagStep]);

  const handleNext = () => {
    if (step < stepLabels.length - 1) setStep((s) => (s + 1) as StepIndex);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => (s - 1) as StepIndex);
  };

  const toggleLiso = (product: ProductItem) => {
    setSelectedLisos((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      if (prev.length >= pack.lisos) return prev;
      return [...prev, product];
    });
  };

  const toggleEstampado = (product: ProductItem) => {
    setSelectedEstampados((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      if (prev.length >= pack.estampados) return prev;
      return [...prev, product];
    });
  };

  const handlePagar = () => {
    const addByQuantity = (items: ProductItem[]) => {
      const byId = new Map<number, { product: ProductItem; qty: number }>();
      items.forEach((p) => {
        const prev = byId.get(p.id);
        if (prev) prev.qty += 1;
        else byId.set(p.id, { product: p, qty: 1 });
      });
      byId.forEach(({ product, qty }) => addToCart({ product, quantity: qty }));
    };
    addByQuantity(selectedLisos);
    addByQuantity(selectedEstampados);
    if (selectedWetbag) addToCart({ product: selectedWetbag, quantity: 1 });
    if (filtroProduct) addToCart({ product: filtroProduct, quantity: 1 });
    if (detergenteProduct) addToCart({ product: detergenteProduct, quantity: 1 });
    onComplete?.();
    onClose();
  };

  const accent = pack.color === 'green' ? BRAND_GREEN : BRAND_PURPLE;
  const accentHover = pack.color === 'green' ? BRAND_GREEN_HOVER : BRAND_PURPLE_HOVER;

  const renderStepContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: accent }} />
        </Box>
      );
    }
    if (error) {
      return (
        <Typography color="error" sx={{ py: 3, textAlign: 'center' }}>
          {error}
        </Typography>
      );
    }

    const resumenStepIndex = hasWetbagStep ? 3 : 2;
    if (step === resumenStepIndex) {
      return (
        <Box sx={{ px: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Lisos ({selectedLisos.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedLisos.map((p) => (
              <Box
                key={p.id}
                component="img"
                src={p.images || '/imgs/placeholder.png'}
                alt={p.name}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            ))}
          </Stack>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Estampados ({selectedEstampados.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedEstampados.map((p) => (
              <Box
                key={p.id}
                component="img"
                src={p.images || '/imgs/placeholder.png'}
                alt={p.name}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            ))}
          </Stack>
          {hasWetbagStep && selectedWetbag && (
            <>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Bolsa impermeable
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={selectedWetbag.images || '/imgs/placeholder.png'}
                  alt={selectedWetbag.name}
                  sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                />
                <Typography variant="body2">{selectedWetbag.name}</Typography>
              </Stack>
            </>
          )}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {filtroProduct && (
              <Box
                component="img"
                src={filtroProduct.images || '/imgs/placeholder.png'}
                alt="Filtro bambú"
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            )}
            {detergenteProduct && (
              <Box
                component="img"
                src={detergenteProduct.images || '/imgs/placeholder.png'}
                alt="Detergente"
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            )}
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 700, color: accent }}>
            Precio del pack: ${pack.priceDiscounted.toLocaleString('es-MX')}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePagar}
            sx={{
              mt: 2,
              bgcolor: accent,
              minHeight: 48,
              fontWeight: 600,
              '&:hover': { bgcolor: accentHover },
            }}
          >
            Pagar
          </Button>
        </Box>
      );
    }

    if (step === 0) {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
          {lisosList.map((p) => {
            const selected = selectedLisos.some((x) => x.id === p.id);
            return (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 2,
                  border: selected ? `3px solid ${accent}` : 'none',
                  overflow: 'hidden',
                }}
              >
                <CardActionArea onClick={() => toggleLiso(p)}>
                  <CardMedia
                    component="img"
                    image={p.images || '/imgs/placeholder.png'}
                    alt={p.name}
                    sx={{ aspectRatio: '1', objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                    {selected && (
                      <Typography variant="caption" sx={{ color: accent, fontWeight: 600 }}>
                        {selectedLisos.length}/{pack.lisos}
                      </Typography>
                    )}
                  </Box>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      );
    }

    if (step === 1) {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
          {estampadosList.map((p) => {
            const selected = selectedEstampados.some((x) => x.id === p.id);
            return (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 2,
                  border: selected ? `3px solid ${accent}` : 'none',
                  overflow: 'hidden',
                }}
              >
                <CardActionArea onClick={() => toggleEstampado(p)}>
                  <CardMedia
                    component="img"
                    image={p.images || '/imgs/placeholder.png'}
                    alt={p.name}
                    sx={{ aspectRatio: '1', objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                    {selected && (
                      <Typography variant="caption" sx={{ color: accent, fontWeight: 600 }}>
                        {selectedEstampados.length}/{pack.estampados}
                      </Typography>
                    )}
                  </Box>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      );
    }

    if (step === 2 && hasWetbagStep) {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, px: 1 }}>
          {wetbagList.map((p) => {
            const selected = selectedWetbag?.id === p.id;
            return (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 2,
                  border: selected ? `3px solid ${accent}` : 'none',
                  overflow: 'hidden',
                }}
              >
                <CardActionArea onClick={() => setSelectedWetbag(p)}>
                  <CardMedia
                    component="img"
                    image={p.images || '/imgs/placeholder.png'}
                    alt={p.name}
                    sx={{ aspectRatio: '1', objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="body2" noWrap>
                      {p.name}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      );
    }

    return null;
  };

  const isResumenStep = step === (hasWetbagStep ? 3 : 2);
  const showNext = !isResumenStep && !loading && !error;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          maxWidth: 480,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mx: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={step === 0 ? onClose : handleBack} aria-label={step === 0 ? 'Cerrar' : 'Atrás'}>
            {step === 0 ? <CloseIcon /> : <ArrowBackIosNewIcon fontSize="small" />}
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600}>
            {stepLabels[step]}
          </Typography>
          <Box sx={{ width: 40 }} />
        </Stack>
        <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
          {renderStepContent()}
        </Box>
        {showNext && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!canNext()}
              onClick={handleNext}
              endIcon={<ArrowForwardIosIcon />}
              sx={{
                bgcolor: accent,
                minHeight: 48,
                fontWeight: 600,
                '&:hover': { bgcolor: accentHover },
                '&:disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              Siguiente
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
