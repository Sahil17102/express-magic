import { alpha, Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { FiBarChart2, FiMapPin, FiShield, FiUsers, FiZap } from 'react-icons/fi'
import { BRAND } from '../../config/brand'
import PhoneForm from './PhoneForm'

const { teal, tealDark, orange, ink, text, muted, paper, tealSoft, skySoft } = BRAND.colors

type FeatureTileProps = {
  icon: ReactNode
  title: string
  copy: string
}

function FeatureTile({ icon, title, copy }: FeatureTileProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr',
        gap: 1.5,
        alignItems: 'center',
        minWidth: 0,
        px: { md: 1.35, lg: 1.8 },
        py: 1.1,
        '&:not(:last-of-type)': {
          borderRight: `1px solid ${alpha(teal, 0.12)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: teal,
          background: `linear-gradient(135deg, ${alpha(paper, 0.94)}, ${alpha(skySoft, 0.76)})`,
          boxShadow: `inset 0 1px 0 ${alpha(paper, 0.92)}`,
          fontSize: 23,
        }}
      >
        {icon}
      </Box>
      <Box minWidth={0}>
        <Typography sx={{ color: ink, fontSize: 14, fontWeight: 900, lineHeight: 1.25 }}>{title}</Typography>
        <Typography sx={{ mt: 0.55, color: muted, fontSize: 12.5, lineHeight: 1.42 }}>{copy}</Typography>
      </Box>
    </Box>
  )
}

function FloatingBadge({ icon, label, sx }: { icon: ReactNode; label: string; sx: Record<string, unknown> }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.9,
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        color: ink,
        background: alpha(paper, 0.96),
        border: `1px solid ${alpha(teal, 0.14)}`,
        boxShadow: '0 18px 34px rgba(6, 26, 51, 0.12)',
        fontSize: 12,
        fontWeight: 900,
        animation: 'floatSoft 4.8s ease-in-out infinite',
        ...sx,
      }}
    >
      <Box
        sx={{
          color: teal,
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
        }}
      >
        {icon}
      </Box>
      {label}
    </Box>
  )
}

function Pin({ color = orange, sx }: { color?: string; sx: Record<string, unknown> }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 4,
        width: 28,
        height: 28,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        background: color,
        boxShadow: `0 12px 22px ${alpha(color, 0.26)}`,
        animation: 'pinBob 3.8s ease-in-out infinite',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: paper,
          left: 9.5,
          top: 9.5,
        },
        ...sx,
      }}
    />
  )
}

function BoxStack() {
  const parcels = [
    { left: 0, bottom: 0, width: 56, height: 42 },
    { left: 48, bottom: 0, width: 62, height: 47 },
    { left: 100, bottom: 0, width: 54, height: 38 },
    { left: 22, bottom: 42, width: 50, height: 38 },
    { left: 80, bottom: 47, width: 60, height: 34 },
  ]

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 30,
        bottom: 34,
        width: 170,
        height: 96,
        zIndex: 4,
      }}
    >
      {parcels.map((parcel) => (
        <Box
          key={`${parcel.left}-${parcel.bottom}`}
          sx={{
            position: 'absolute',
            left: parcel.left,
            bottom: parcel.bottom,
            width: parcel.width,
            height: parcel.height,
            borderRadius: 0.6,
            background: 'linear-gradient(135deg, #c79556 0%, #e0b77d 58%, #b77e43 100%)',
            border: '1px solid rgba(103, 64, 29, 0.22)',
            boxShadow: '0 10px 18px rgba(72, 45, 23, 0.12)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '43%',
              width: 9,
              height: '100%',
              background: 'rgba(110, 69, 33, 0.18)',
            },
            '&::after': {
              content: '"F G"',
              position: 'absolute',
              left: 8,
              bottom: 6,
              color: 'rgba(42, 29, 21, 0.68)',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '0.08em',
            },
          }}
        />
      ))}
    </Box>
  )
}

function CargoContainer() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: { md: 98, lg: 118 },
        bottom: 58,
        width: { md: 260, lg: 288 },
        height: { md: 108, lg: 122 },
        zIndex: 3,
        borderRadius: 1,
        background: 'linear-gradient(90deg, #062A5B 0%, #0B3B7A 46%, #041A38 76%, #ED1C24 100%)',
        border: `1px solid ${alpha(tealDark, 0.22)}`,
        boxShadow: '0 26px 38px rgba(6, 26, 51, 0.18)',
        overflow: 'hidden',
        animation: 'cargoFloat 5.5s ease-in-out infinite',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0 2px, transparent 2px 22px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.16), transparent 30%, rgba(0,0,0,0.18))',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 58,
          top: 34,
          width: 34,
          height: 42,
          borderRadius: 0.8,
          display: 'grid',
          placeItems: 'center',
          zIndex: 2,
          color: teal,
          background: alpha(paper, 0.92),
          fontWeight: 900,
          fontSize: 21,
          boxShadow: '0 8px 16px rgba(0,0,0,0.13)',
        }}
      >
        F
      </Box>
      <Box
        sx={{
          position: 'absolute',
          left: 90,
          top: 55,
          width: 34,
          height: 36,
          borderRadius: 0.8,
          display: 'grid',
          placeItems: 'center',
          zIndex: 2,
          color: paper,
          background: orange,
          fontWeight: 900,
          fontSize: 19,
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        }}
      >
        G
      </Box>
    </Box>
  )
}

function DeliveryTruck() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: { md: 322, lg: 350 },
        bottom: 48,
        width: { md: 245, lg: 270 },
        height: { md: 124, lg: 132 },
        zIndex: 4,
        animation: 'truckFloat 4.8s ease-in-out infinite',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 27,
          width: '57%',
          height: 88,
          borderRadius: '7px 4px 3px 3px',
          background: 'linear-gradient(135deg, #eff5f7 0%, #cdd9dd 100%)',
          border: '1px solid rgba(91, 113, 120, 0.18)',
          boxShadow: '0 18px 30px rgba(18, 44, 54, 0.16)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 28,
            top: 26,
            width: 30,
            height: 38,
            borderRadius: 0.8,
            background: teal,
            color: paper,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 15,
          }}
        >
          F
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: 52,
            top: 45,
            width: 18,
            height: 24,
            borderRadius: 0.6,
            background: orange,
            color: paper,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 11,
          }}
        >
          G
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 10,
          bottom: 27,
          width: '45%',
          height: 86,
          borderRadius: '9px 18px 5px 3px',
          background: 'linear-gradient(135deg, #eef4f5 0%, #b9c9cf 100%)',
          border: '1px solid rgba(91, 113, 120, 0.2)',
          boxShadow: '0 18px 30px rgba(18, 44, 54, 0.18)',
          '&::before': {
            content: '""',
            position: 'absolute',
            right: 20,
            top: 16,
            width: 54,
            height: 29,
            borderRadius: '5px 12px 3px 3px',
            background: 'linear-gradient(135deg, #57747c, #16343d)',
            boxShadow: `inset 0 0 0 2px ${alpha(paper, 0.18)}`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 5,
            bottom: 23,
            width: 22,
            height: 8,
            borderRadius: 5,
            background: '#fff8d5',
            boxShadow: `0 0 20px ${alpha('#fff4a8', 0.75)}`,
            animation: 'headlight 2.2s ease-in-out infinite',
          },
        }}
      />

      {[54, 178].map((left) => (
        <Box
          key={left}
          sx={{
            position: 'absolute',
            left,
            bottom: 14,
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#102a31',
            border: '6px solid #5b6e74',
            boxShadow: 'inset 0 0 0 5px #182f37, 0 8px 15px rgba(0,0,0,0.16)',
          }}
        />
      ))}
    </Box>
  )
}

function ShipmentScene() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 0,
        height: { md: 318, lg: 350 },
        mt: { md: 0.2, lg: 0.3 },
        mb: { md: 0.4, lg: 0.5 },
        overflow: 'visible',
        '@keyframes floatSoft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        '@keyframes pinBob': {
          '0%, 100%': { marginTop: 0 },
          '50%': { marginTop: -9 },
        },
        '@keyframes cargoFloat': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        '@keyframes truckFloat': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        '@keyframes headlight': {
          '0%, 100%': { opacity: 0.72 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <Box
        component="img"
        src="/images/express-magic-login-3d.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        sx={{
          position: 'absolute',
          left: { md: -86, lg: -112 },
          right: { md: -86, lg: -112 },
          bottom: { md: 4, lg: 8 },
          width: { md: 'calc(100% + 172px)', lg: 'calc(100% + 224px)' },
          height: { md: 338, lg: 370 },
          objectFit: 'cover',
          objectPosition: 'center 60%',
          filter: 'drop-shadow(0 28px 38px rgba(6, 26, 51, 0.1))',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 58%, rgba(0,0,0,0.82) 72%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse at center, #000 58%, rgba(0,0,0,0.82) 72%, transparent 100%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <FloatingBadge
        icon={<FiBarChart2 />}
        label="Real-time Tracking"
        sx={{
          left: { md: 150, lg: 168 },
          top: { md: 98, lg: 106 },
          animationDelay: '-1.3s',
        }}
      />
      <FloatingBadge
        icon={<FiMapPin />}
        label="Smart Dispatch"
        sx={{
          right: { md: 8, lg: 0 },
          top: { md: 114, lg: 126 },
          animationDelay: '-2.2s',
        }}
      />
      <FloatingBadge
        icon={<FiUsers />}
        label="27+ Global Couriers"
        sx={{
          left: { md: 8, lg: 12 },
          bottom: { md: 68, lg: 82 },
          width: 112,
          flexDirection: 'column',
          gap: 0.45,
          textAlign: 'center',
          animationDelay: '-0.6s',
        }}
      />

      <Pin color={orange} sx={{ right: { md: 100, lg: 112 }, top: { md: 44, lg: 52 } }} />
      <Box sx={{ display: 'none' }}>
        <BoxStack />
        <CargoContainer />
        <DeliveryTruck />
      </Box>
    </Box>
  )
}

function ParcelBeacon() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 150,
        height: 112,
        mx: 'auto',
        mb: 1.4,
        '@keyframes parcelHover': {
          '0%, 100%': {
            transform: 'translateY(0) rotateX(57deg) rotateZ(-35deg)',
          },
          '50%': {
            transform: 'translateY(-8px) rotateX(57deg) rotateZ(-35deg)',
          },
        },
        '@keyframes orbitSweep': {
          '0%': { strokeDashoffset: 210 },
          '100%': { strokeDashoffset: 0 },
        },
        '@keyframes beaconPulse': {
          '0%, 100%': { opacity: 0.45, transform: 'scale(0.96)' },
          '50%': { opacity: 0.9, transform: 'scale(1.03)' },
        },
      }}
    >
      <Box component="svg" viewBox="0 0 150 112" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <ellipse cx="75" cy="70" rx="61" ry="18" fill={alpha(teal, 0.08)} />
        <path
          d="M22 64C52 20 103 19 130 58"
          fill="none"
          stroke={alpha(teal, 0.36)}
          strokeWidth="1.6"
          strokeDasharray="6 8"
          style={{ animation: 'orbitSweep 8s linear infinite' }}
        />
        <path
          d="M31 80C58 100 101 101 125 77"
          fill="none"
          stroke={alpha(orange, 0.42)}
          strokeWidth="1.8"
          strokeDasharray="7 8"
          style={{ animation: 'orbitSweep 7s linear infinite reverse' }}
        />
        <circle cx="30" cy="63" r="4" fill={paper} stroke={teal} strokeWidth="2" />
        <circle cx="125" cy="58" r="4" fill={paper} stroke={orange} strokeWidth="2" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 20,
          width: 64,
          height: 64,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          animation: 'parcelHover 4.6s ease-in-out infinite',
          ml: '-32px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            background: 'linear-gradient(145deg, #efc38c 0%, #c98b4a 100%)',
            boxShadow: '0 24px 34px rgba(6, 26, 51, 0.16)',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '0 27px',
              background: 'rgba(102, 62, 25, 0.18)',
            },
            '&::after': {
              content: '"EM"',
              position: 'absolute',
              right: 10,
              bottom: 10,
              width: 26,
              height: 26,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 0.8,
              background: teal,
              color: paper,
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: 0,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 18,
          width: 86,
          height: 14,
          ml: '-43px',
          borderRadius: '50%',
          background: alpha(teal, 0.2),
          filter: 'blur(8px)',
          animation: 'beaconPulse 4.6s ease-in-out infinite',
        }}
      />
    </Box>
  )
}

export default function LoginForm() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        height: { xs: 'auto', md: '100dvh' },
        width: '100%',
        overflowX: 'hidden',
        overflowY: { xs: 'auto', md: 'hidden' },
        touchAction: 'pan-y pinch-zoom',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 1.25, sm: 2.5, md: 4.5, lg: 6 },
        py: { xs: 1.25, sm: 2, md: 4.5 },
        background:
          `linear-gradient(90deg, ${alpha(teal, 0.052)} 1px, transparent 1px) 0 0 / 52px 52px, ` +
          `linear-gradient(${alpha(teal, 0.046)} 1px, transparent 1px) 0 0 / 52px 52px, ` +
          `linear-gradient(135deg, ${alpha(orange, 0.055)} 0%, transparent 28%, ${alpha(teal, 0.06)} 100%), ` +
          'linear-gradient(180deg, #ffffff 0%, #f7fbff 58%, #EEF4FB 100%)',
      }}
    >
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: 'min(430px, 100%)',
            md: '100%',
          },
          maxWidth: 1320,
          mx: 'auto',
          height: { xs: 'auto', md: 'calc(100dvh - 72px)' },
          maxHeight: { md: 760, lg: 792 },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1.05fr) minmax(430px, 0.92fr)',
          },
          gap: { xs: 2.5, md: 5.5, lg: 6.5 },
          alignItems: 'stretch',
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            minHeight: 0,
            height: '100%',
            pt: { md: 2.8, lg: 3.8 },
            pb: { md: 0.4, lg: 0.8 },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 6 }}>
            <Typography
              sx={{
                color: orange,
                fontWeight: 900,
                fontSize: { md: 15, lg: 16 },
                lineHeight: 1.2,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                mb: { md: 2.2, lg: 2.6 },
              }}
            >
              One platform. All couriers.
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: ink,
                fontWeight: 900,
                fontSize: { md: 54, lg: 62 },
                lineHeight: 1.08,
                letterSpacing: 0,
                mb: { md: 1.8, lg: 2.1 },
              }}
            >
              Your Shipments.
              <Box component="span" sx={{ display: 'block', color: teal }}>
                One Smarter Way.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: ink,
                fontSize: { md: 18, lg: 20 },
                fontWeight: 500,
                lineHeight: 1.55,
                maxWidth: 550,
              }}
            >
              Access multiple courier partners, compare rates in real time and ship with confidence - all from a single
              platform.
            </Typography>
          </Box>

          <ShipmentScene />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              alignItems: 'stretch',
              minHeight: { md: 90, lg: 96 },
              borderRadius: 2,
              border: `1px solid ${alpha(teal, 0.12)}`,
              background: alpha(paper, 0.92),
              boxShadow: '0 18px 42px rgba(6, 26, 51, 0.09)',
              backdropFilter: 'blur(14px)',
              overflow: 'hidden',
              transform: { md: 'translateY(54px)', lg: 'translateY(62px)' },
              position: 'relative',
              zIndex: 2,
            }}
          >
            <FeatureTile icon={<FiUsers />} title="27+ Couriers" copy="One integration for all your shipments" />
            <FeatureTile icon={<FiShield />} title="Best Rates" copy="Compare and choose the most reliable rates" />
            <FeatureTile icon={<FiZap />} title="Faster Deliveries" copy="Optimized routing for on-time deliveries" />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minWidth: 0,
            minHeight: { xs: 'auto', md: 0 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              maxWidth: { xs: '100%', sm: 430, md: 560 },
              height: 'auto',
              maxHeight: 'none',
              minHeight: { xs: 'auto', md: 0 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              borderRadius: 2,
              border: `1px solid ${alpha(paper, 0.86)}`,
              background:
                `linear-gradient(180deg, ${alpha(paper, 0.92)} 0%, ${alpha(paper, 0.98)} 72%), ` +
                `linear-gradient(135deg, ${alpha(tealSoft, 0.8)}, ${alpha(skySoft, 0.42)})`,
              boxShadow: '0 26px 74px rgba(6, 26, 51, 0.13)',
              backdropFilter: 'blur(18px)',
              px: { xs: 1.5, sm: 3.2, md: 3.6, lg: 4 },
              py: { xs: 2.4, sm: 3, md: 3.2, lg: 3.4 },
              overflow: 'hidden',
              touchAction: 'pan-y pinch-zoom',
            }}
          >
            <Box sx={{ mb: { xs: 1.7, md: 1.9 }, textAlign: 'center' }}>
              <ParcelBeacon />
              <Typography
                component="h2"
                sx={{
                  color: ink,
                  fontWeight: 900,
                  fontSize: { xs: 30, sm: 33 },
                  lineHeight: 1.1,
                  letterSpacing: 0,
                }}
              >
                Welcome back!
              </Typography>
              <Typography
                sx={{
                  mt: 1.15,
                  color: text,
                  fontSize: { xs: 14.5, sm: 15.5 },
                  lineHeight: 1.55,
                  maxWidth: { xs: 300, sm: 360 },
                  mx: 'auto',
                }}
              >
                Sign in to access your dashboard and manage your shipments.
              </Typography>
            </Box>

            <PhoneForm />

            <Box
              sx={{
                mt: { xs: 1.8, md: 2 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: muted,
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 650,
                textAlign: 'center',
                flexWrap: 'wrap',
                maxWidth: { xs: 300, sm: 'none' },
                mx: 'auto',
              }}
            >
              <FiShield size={16} />
              Your data is safe with us. We never share your email.
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
