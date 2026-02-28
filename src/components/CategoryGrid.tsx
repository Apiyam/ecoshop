'use client'

import { useKeenSlider } from 'keen-slider/react'
import { Card, IconButton, Box } from '@mui/joy'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import { useEffect } from 'react'
import { CategoryItem } from '../lib/wooApi'
import { useMediaQuery } from '@mui/material'


type CategorySliderProps = {
  categories: CategoryItem[],
  onCategoryChange: (category: CategoryItem) => void
}

export default function CategorySlider({ categories, onCategoryChange }: CategorySliderProps) {
    const isMobile = useMediaQuery('(max-width: 600px)')
    
    useEffect(() => {
        const interval = setInterval(() => {
          instanceRef.current?.next()
        }, 7000)
        return () => clearInterval(interval)
      }, [])
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: isMobile ? 2 : 5, spacing: 3 },
    created(s) {
      setTimeout(() => s.moveToIdx(3, true), 100)
    },
    // autoplay: true,
  })

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', py: 2 }}>
      {/* Controles */}
      <IconButton
        onClick={() => instanceRef.current?.prev()}
        sx={{ position: 'absolute', left: 0, top: '40%', zIndex: 1 }}
        variant="soft"
        size="sm"
      >
        <ArrowLeft />
      </IconButton>
      <IconButton
        onClick={() => instanceRef.current?.next()}
        sx={{ position: 'absolute', right: 0, top: '40%', zIndex: 1 }}
        variant="soft"
        size="sm"
      >
        <ArrowRight />
      </IconButton>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {categories.map((cat, idx) => (
          <div className="keen-slider__slide" key={idx}>
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 'md',
                  borderColor: 'neutral.outlinedHoverBorder',
                  backgroundColor: 'primary.outlinedHoverBg',
                },
              }}
              onClick={() => onCategoryChange(cat)}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 0,
                  paddingBottom: '100%',
                  position: 'relative',
                  bgcolor: 'neutral.100',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Card>
          </div>
        ))}
      </div>
    </Box>
  )
}
