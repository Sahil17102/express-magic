import { alpha, Box, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { FiBox, FiCheckCircle } from 'react-icons/fi'
import { TbRulerMeasure, TbScale } from 'react-icons/tb'
import { BRAND } from '../../config/brand'

const { teal, tealDark, orange, muted, border } = BRAND.colors

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    bgcolor: '#FFFFFF',
    fontWeight: 800,
    '& fieldset': { borderColor: border },
    '&:hover fieldset': { borderColor: teal },
    '&.Mui-focused fieldset': { borderColor: teal, borderWidth: 1 },
  },
  '& .MuiInputLabel-root': { fontWeight: 800, color: '#32445F' },
}

export default function WeightCalculator() {
  const [length, setLength] = useState('24')
  const [breadth, setBreadth] = useState('18')
  const [height, setHeight] = useState('12')
  const [actualWeight, setActualWeight] = useState('0.8')
  const [divisor, setDivisor] = useState('5000')

  const calculation = useMemo(() => {
    const l = Number(length) || 0
    const b = Number(breadth) || 0
    const h = Number(height) || 0
    const actual = Number(actualWeight) || 0
    const divisorValue = Number(divisor) || 5000
    const volumetric = l > 0 && b > 0 && h > 0 ? (l * b * h) / divisorValue : 0
    const minimum = 0.5
    const chargeable = Math.max(actual, volumetric, minimum)
    const source =
      chargeable === volumetric ? 'Volumetric weight' : chargeable === actual ? 'Actual weight' : 'Minimum slab'

    return {
      volumetric,
      actual,
      chargeable,
      source,
      volume: l * b * h,
    }
  }, [actualWeight, breadth, divisor, height, length])

  const resultCards = [
    {
      label: 'Actual Weight',
      value: `${calculation.actual.toFixed(2)} kg`,
      icon: <TbScale />,
      color: teal,
      bg: alpha(teal, 0.08),
    },
    {
      label: 'Volumetric Weight',
      value: `${calculation.volumetric.toFixed(2)} kg`,
      icon: <TbRulerMeasure />,
      color: orange,
      bg: alpha(orange, 0.08),
    },
    {
      label: 'Chargeable Weight',
      value: `${calculation.chargeable.toFixed(2)} kg`,
      icon: <FiCheckCircle />,
      color: tealDark,
      bg: alpha(teal, 0.1),
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 86% 10%, rgba(237,28,36,0.13), transparent 28%), radial-gradient(circle at 12% 24%, rgba(6,42,91,0.12), transparent 30%), linear-gradient(180deg, #FFFFFF 0%, #F5F8FC 48%, #EEF4FB 100%)',
        px: { xs: 1.8, md: 4 },
        py: { xs: 2.5, md: 6 },
      }}
    >
      <Stack sx={{ width: '100%', maxWidth: 1220, mx: 'auto' }} spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.92fr 1.08fr' },
            gap: { xs: 2.4, md: 4 },
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: 4, md: 5 },
              border: `1px solid ${alpha('#07142F', 0.13)}`,
              p: { xs: 3, md: 5 },
              minHeight: { xs: 420, md: 620 },
              background:
                'linear-gradient(rgba(6,42,91,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(6,42,91,0.055) 1px, transparent 1px), #FFFFFF',
              backgroundSize: '44px 44px',
              boxShadow: '0 30px 90px rgba(7,20,47,0.12)',
            }}
          >
            <Typography
              sx={{
                color: orange,
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Weight clarity
            </Typography>
            <Typography
              component="h1"
              sx={{
                mt: 2.5,
                color: '#07142F',
                fontSize: { xs: '3rem', md: '5rem' },
                fontWeight: 950,
                letterSpacing: '-0.06em',
                lineHeight: 0.94,
              }}
            >
              Measure right.
              <Box component="span" sx={{ display: 'block', color: teal }}>
                Ship lighter.
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 3,
                maxWidth: 560,
                color: '#31415B',
                fontSize: { xs: '1rem', md: '1.12rem' },
                fontWeight: 650,
                lineHeight: 1.8,
              }}
            >
              Compare actual and volumetric weight before booking so your shipment uses the right
              slab from the start.
            </Typography>

            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                right: { xs: -72, md: 16 },
                bottom: { xs: -78, md: -54 },
                width: { xs: 240, md: 300 },
                height: { xs: 240, md: 300 },
                borderRadius: '50%',
                border: `1px dashed ${alpha(teal, 0.25)}`,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '18%',
                  borderRadius: 6,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF',
                  bgcolor: teal,
                  boxShadow: '0 26px 70px rgba(6,42,91,0.24)',
                  transform: 'rotate(-7deg)',
                  fontSize: { xs: 78, md: 104 },
                }}
              >
                <FiBox />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  right: '12%',
                  top: '18%',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: orange,
                  boxShadow: `0 0 0 12px ${alpha(orange, 0.12)}`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '15%',
                  bottom: '20%',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: teal,
                  boxShadow: `0 0 0 12px ${alpha(teal, 0.12)}`,
                }}
              />
            </Box>
          </Box>

          <CardContent
            sx={{
              alignSelf: 'center',
              borderRadius: { xs: 3, md: 4 },
              border: `1px solid ${alpha('#07142F', 0.12)}`,
              boxShadow: '0 24px 70px rgba(7, 20, 47, 0.1)',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(18px)',
              p: { xs: 2.4, md: 3.2 },
            }}
          >
            <Typography
              sx={{
                color: orange,
                fontSize: '0.76rem',
                fontWeight: 900,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Weight calculator
            </Typography>
            <Typography
              sx={{
                mt: 1.2,
                color: '#07142F',
                fontSize: { xs: '1.8rem', md: '2.55rem' },
                fontWeight: 950,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              Find chargeable weight
            </Typography>
            <Typography sx={{ color: '#4B5870', mt: 1.4, mb: 2.5, fontSize: '0.94rem', lineHeight: 1.7 }}>
              Enter parcel dimensions in centimeters and actual weight in kilograms.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Length" type="number" value={length} onChange={(e) => setLength(e.target.value)} fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Breadth" type="number" value={breadth} onChange={(e) => setBreadth(e.target.value)} fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Actual Weight (kg)" type="number" value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} fullWidth sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField select label="Volumetric Divisor" value={divisor} onChange={(e) => setDivisor(e.target.value)} fullWidth sx={fieldSx}>
                  <MenuItem value="5000">5000 - Standard air</MenuItem>
                  <MenuItem value="4000">4000 - Dense courier slab</MenuItem>
                  <MenuItem value="27000">27000 - B2B CFT</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 2.6,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 1.4,
              }}
            >
              {resultCards.map((card) => (
                <Box
                  key={card.label}
                  sx={{
                    border: `1px solid ${alpha('#07142F', 0.1)}`,
                    borderRadius: 3,
                    p: 1.7,
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <Box sx={{ color: card.color, bgcolor: card.bg, width: 38, height: 38, borderRadius: 2.4, display: 'grid', placeItems: 'center', fontSize: 21 }}>
                    {card.icon}
                  </Box>
                  <Typography sx={{ mt: 1.4, color: '#64748B', fontSize: '0.74rem', fontWeight: 850 }}>
                    {card.label}
                  </Typography>
                  <Typography sx={{ mt: 0.4, color: '#07142F', fontSize: '1.38rem', fontWeight: 950 }}>
                    {card.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                mt: 2.4,
                borderRadius: 3,
                border: `1px solid ${alpha(teal, 0.12)}`,
                background: `linear-gradient(135deg, ${alpha(teal, 0.06)}, ${alpha(orange, 0.055)})`,
                p: 1.8,
              }}
            >
              <Typography sx={{ color: '#07142F', fontWeight: 950 }}>
                Billing slab: {calculation.source}
              </Typography>
              <Typography sx={{ mt: 0.45, color: muted, fontSize: '0.82rem', fontWeight: 700 }}>
                Package volume is {calculation.volume.toLocaleString('en-IN')} cubic cm. Courier
                billing usually uses the higher of actual and volumetric weight.
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Stack>
    </Box>
  )
}
