'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProductItem } from '@/lib/wooApi';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import {
  ExpoPack,
  PARENT_IDS,
  PACK_SELECTION_STORAGE_KEY,
  WEBHOOK_URL,
} from './types';
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER, BRAND_GREEN_HOVER } from '@/lib/constants';

/** Nombre para mostrar: quitar prefijo de categoría para que se vea el color/variación y permitir nombre completo */
function getDisplayName(p: ProductItem): string {
  let n = p.name.replace(/6 Meses - 6 Años/gi, '').trim();
  const parent = (p.parent_name || '').replace(/^Privado:\s*/i, '').trim();
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    n = n.slice(parent.length).replace(/^[\s\-–]+/, '').trim();
  }
  return n || p.name;
}

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
  const { setPackInCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepIndex>(0);
  const [selectedLisos, setSelectedLisos] = useState<ProductItem[]>([]);
  const [selectedEstampados, setSelectedEstampados] = useState<ProductItem[]>([]);
  const [selectedWetbag, setSelectedWetbag] = useState<ProductItem | null>(null);
  const historyKeyRef = useRef<string | null>(null);

  const hasWetbagStep = pack.wetbag > 0;
  const stepLabels = hasWetbagStep
    ? ['Elige tus lisos', 'Elige tus estampados', 'Elige tu bolsa impermeable', 'Resumen']
    : ['Elige tus lisos', 'Elige tus estampados', 'Resumen'];

  const lisosList = products.filter((p) => p.parent === PARENT_IDS.LISOS && (p.stock ?? 0) > 0);
  const estampadosList = products.filter((p) => p.parent === PARENT_IDS.ESTAMPADOS && (p.stock ?? 0) > 0);
  const wetbagList = products.filter((p) => p.parent === PARENT_IDS.WETBAG && (p.stock ?? 0) > 0);
  const filtroProduct = products.find((p) => p.parent === PARENT_IDS.FILTRO_BAMBU || p.id === PARENT_IDS.FILTRO_BAMBU)
    ?? products.find((p) => p.id === PARENT_IDS.FILTRO_BAMBU);
  const detergenteProduct = products.find((p) => p.parent === PARENT_IDS.DETERGENTE || p.id === PARENT_IDS.DETERGENTE)
    ?? products.find((p) => p.id === PARENT_IDS.DETERGENTE);

  // Persistir selección para no perderla al salir o regresar (no guardar mientras carga para no pisar lo restaurado desde Editar)
  const saveSelection = useCallback(() => {
    try {
      const payload = {
        lisos: selectedLisos.map((p) => p.id),
        estampados: selectedEstampados.map((p) => p.id),
        wetbagId: selectedWetbag?.id ?? null,
      };
      sessionStorage.setItem(PACK_SELECTION_STORAGE_KEY(pack.id), JSON.stringify(payload));
    } catch {}
  }, [pack.id, selectedLisos, selectedEstampados, selectedWetbag]);

  useEffect(() => {
    if (loading) return;
    saveSelection();
  }, [saveSelection, loading]);

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
        try {
          const saved = sessionStorage.getItem(PACK_SELECTION_STORAGE_KEY(pack.id));
          if (saved) {
            const { lisos, estampados, wetbagId } = JSON.parse(saved);
            const byId = new Map(normalized.map((p) => [p.id, p]));
            const getProduct = (id: number | string) => byId.get(Number(id)) ?? byId.get(id as number);
            if (Array.isArray(lisos)) {
              const rest = lisos.map((id) => getProduct(id)).filter(Boolean) as ProductItem[];
              if (rest.length <= pack.lisos) setSelectedLisos(rest);
            }
            if (Array.isArray(estampados)) {
              const rest = estampados.map((id) => getProduct(id)).filter(Boolean) as ProductItem[];
              if (rest.length <= pack.estampados) setSelectedEstampados(rest);
            }
            if (wetbagId != null && pack.wetbag > 0) {
              const w = getProduct(wetbagId);
              if (w) setSelectedWetbag(w);
            }
          }
        } catch {}
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }, [open, pack.id, pack.lisos, pack.estampados, pack.wetbag]);

  // Historial del navegador: "atrás" vuelve al paso anterior
  useEffect(() => {
    if (!open) return;
    const key = `pack-${pack.id}-${Date.now()}`;
    historyKeyRef.current = key;
    if (typeof window !== 'undefined') {
      window.history.pushState({ packWizard: key, step: 0 }, '');
    }
    const onPopState = (e: PopStateEvent) => {
      const state = (e.state ?? window.history.state) as { packWizard?: string; step?: number } | null;
      if (state?.packWizard === historyKeyRef.current && typeof state.step === 'number') {
        setStep(Math.max(0, Math.min(state.step, stepLabels.length - 1)) as StepIndex);
      } else {
        onClose();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [open, pack.id, onClose, stepLabels.length]);


  const canNext = useCallback(() => {
    if (step === 0) return selectedLisos.length === pack.lisos;
    if (step === 1) return selectedEstampados.length === pack.estampados;
    if (step === 2 && hasWetbagStep) return selectedWetbag != null;
    return true;
  }, [step, pack, selectedLisos.length, selectedEstampados.length, selectedWetbag, hasWetbagStep]);

  const handleNext = () => {
    if (step < stepLabels.length - 1) {
      const next = (step + 1) as StepIndex;
      setStep(next);
      if (typeof window !== 'undefined' && historyKeyRef.current) {
        window.history.pushState({ packWizard: historyKeyRef.current, step: next }, '');
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => (s - 1) as StepIndex);
  };

  // Varias unidades del mismo color permitidas, respetando stock y máximo del pack
  const addLiso = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedLisos((prev) => {
      const countThis = prev.filter((p) => p.id === product.id).length;
      const stock = Math.max(0, product.stock ?? 0);
      if (prev.length >= pack.lisos || countThis >= stock) return prev;
      return [...prev, product];
    });
  };

  const removeLiso = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedLisos((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx < 0) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const addEstampado = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedEstampados((prev) => {
      const countThis = prev.filter((p) => p.id === product.id).length;
      const stock = Math.max(0, product.stock ?? 0);
      if (prev.length >= pack.estampados || countThis >= stock) return prev;
      return [...prev, product];
    });
  };

  const removeEstampado = (product: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedEstampados((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx < 0) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const handlePagar = () => {
    setPackInCart({
      pack,
      selectedLisos: [...selectedLisos],
      selectedEstampados: [...selectedEstampados],
      selectedWetbag,
    });
    try {
      sessionStorage.removeItem(PACK_SELECTION_STORAGE_KEY(pack.id));
    } catch {}
    onComplete?.();
    onClose();
    router.push('/carrito');
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
      const lisosGrouped = new Map<number, { product: ProductItem; count: number }>();
      selectedLisos.forEach((p) => {
        const prev = lisosGrouped.get(p.id);
        if (prev) prev.count += 1;
        else lisosGrouped.set(p.id, { product: p, count: 1 });
      });
      const estampadosGrouped = new Map<number, { product: ProductItem; count: number }>();
      selectedEstampados.forEach((p) => {
        const prev = estampadosGrouped.get(p.id);
        if (prev) prev.count += 1;
        else estampadosGrouped.set(p.id, { product: p, count: 1 });
      });

      return (
        <Box sx={{ px: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Lisos ({selectedLisos.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Array.from(lisosGrouped.values()).map(({ product: p, count }) => (
              <Badge
                key={`liso-${p.id}`}
                badgeContent={count > 1 ? count : undefined}
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', minWidth: 18, height: 18, bgcolor: accent, color: 'white' } }}
              >
                <Box
                  component="img"
                  src={p.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                  alt={p.name}
                  sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                />
              </Badge>
            ))}
          </Stack>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Estampados ({selectedEstampados.length})
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Array.from(estampadosGrouped.values()).map(({ product: p, count }) => (
              <Badge
                key={`estampado-${p.id}`}
                badgeContent={count > 1 ? count : undefined}
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', minWidth: 18, height: 18, bgcolor: accent, color: 'white' } }}
              >
                <Box
                  component="img"
                  src={p.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                  alt={p.name}
                  sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                />
              </Badge>
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
                  src={selectedWetbag.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                  alt={selectedWetbag.name}
                  sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                />
                <Typography variant="body2">{selectedWetbag.name}</Typography>
              </Stack>
            </>
          )}
          <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" >
              Filtro bambú y detergente
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
            {filtroProduct && (
              <Box
                component="img"
                src={filtroProduct.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                alt="Filtro bambú"
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            )}
            {detergenteProduct && (
              <Box
                component="img"
                src={detergenteProduct.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                alt="Detergente"
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
              />
            )}
            </Stack>
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
            const countThis = selectedLisos.filter((x) => x.id === p.id).length;
            const selected = countThis > 0;
            const stock = Math.max(0, p.stock ?? 0);
            const canAdd = selectedLisos.length < pack.lisos && countThis < stock;
            const canRemove = countThis > 0;
            const disabled = !canAdd && !canRemove;
            return (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 2,
                  border: selected ? `3px solid ${accent}` : 'none',
                  overflow: 'hidden',
                  opacity: disabled ? 0.7 : 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={p.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                  alt={p.name}
                  sx={{ aspectRatio: '1', objectFit: 'cover', pointerEvents: 'none' }}
                />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 36,
                    }}
                    title={p.name}
                  >
                    {getDisplayName(p)}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    <IconButton
                      size="large"
                      onClick={(e) => removeLiso(p, e)}
                      disabled={!canRemove}
                      aria-label="Quitar uno"
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid',
                        borderColor: canRemove ? accent : 'action.disabled',
                        color: canRemove ? accent : 'action.disabled',
                        bgcolor: canRemove ? `${accent}20` : 'transparent',
                        '&:hover': canRemove ? { bgcolor: `${accent}30` } : {},
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700, color: selected ? accent : 'text.secondary', fontSize: '1.1rem' }}>
                      {countThis}
                    </Typography>
                    <IconButton
                      size="large"
                      onClick={(e) => addLiso(p, e)}
                      disabled={!canAdd}
                      aria-label="Agregar uno"
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid',
                        borderColor: canAdd ? accent : 'action.disabled',
                        color: canAdd ? accent : 'action.disabled',
                        bgcolor: canAdd ? `${accent}20` : 'transparent',
                        '&:hover': canAdd ? { bgcolor: `${accent}30` } : {},
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {selectedLisos.length}/{pack.lisos}
                  </Typography>
                </Box>
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
            const countThis = selectedEstampados.filter((x) => x.id === p.id).length;
            const selected = countThis > 0;
            const stock = Math.max(0, p.stock ?? 0);
            const canAdd = selectedEstampados.length < pack.estampados && countThis < stock;
            const canRemove = countThis > 0;
            const disabled = !canAdd && !canRemove;
            return (
              <Card
                key={p.id}
                sx={{
                  borderRadius: 2,
                  border: selected ? `3px solid ${accent}` : 'none',
                  overflow: 'hidden',
                  opacity: disabled ? 0.7 : 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={p.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                  alt={p.name}
                  sx={{ aspectRatio: '1', objectFit: 'cover', pointerEvents: 'none' }}
                />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 36,
                    }}
                    title={p.name}
                  >
                    {getDisplayName(p)}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    <IconButton
                      size="large"
                      onClick={(e) => removeEstampado(p, e)}
                      disabled={!canRemove}
                      aria-label="Quitar uno"
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid',
                        borderColor: canRemove ? accent : 'action.disabled',
                        color: canRemove ? accent : 'action.disabled',
                        bgcolor: canRemove ? `${accent}20` : 'transparent',
                        '&:hover': canRemove ? { bgcolor: `${accent}30` } : {},
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700, color: selected ? accent : 'text.secondary', fontSize: '1.1rem' }}>
                      {countThis}
                    </Typography>
                    <IconButton
                      size="large"
                      onClick={(e) => addEstampado(p, e)}
                      disabled={!canAdd}
                      aria-label="Agregar uno"
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid',
                        borderColor: canAdd ? accent : 'action.disabled',
                        color: canAdd ? accent : 'action.disabled',
                        bgcolor: canAdd ? `${accent}20` : 'transparent',
                        '&:hover': canAdd ? { bgcolor: `${accent}30` } : {},
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {selectedEstampados.length}/{pack.estampados}
                  </Typography>
                </Box>
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
                    image={p.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'}
                    alt={p.name}
                    sx={{ aspectRatio: '1', objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 36,
                      }}
                      title={p.name}
                    >
                      {getDisplayName(p)}
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
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          maxWidth: 480,
          width: '100%',
          maxHeight: '85vh',
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
