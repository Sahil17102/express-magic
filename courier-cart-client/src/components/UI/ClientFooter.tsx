import { alpha, Box, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { FiChevronRight, FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const platformLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Track Shipment', to: '/tools/order_tracking' },
  { label: 'Rate Calculator', to: '/tools/rate_calculator' },
  { label: 'Weight Calculator', to: '/tools/weight_calculator' },
]

const companyLinks = [
  { label: `About ${BRAND.name}`, to: '/support/about_us' },
  { label: 'Contact Us', to: '/policies/contact_us' },
  { label: 'Terms & Conditions', to: '/policies/terms_of_service' },
  { label: 'Privacy Policy', to: '/policies/privacy_policy' },
]

const linkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  width: 'fit-content',
  color: BRAND.colors.muted,
  fontSize: { xs: '0.9rem', sm: '0.95rem' },
  fontWeight: 600,
  lineHeight: 1.5,
  textDecoration: 'none',
  transition: 'color 180ms ease, transform 180ms ease',
  '& svg': {
    flexShrink: 0,
  },
  '&:hover': {
    color: BRAND.colors.teal,
    transform: 'translateX(3px)',
  },
} as const

function FooterLinks({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <Box>
      <Typography component="h2" sx={{ color: BRAND.colors.ink, fontSize: '1rem', fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={1.35}>
        {links.map((link) => (
          <Box key={link.to} component={RouterLink} to={link.to} sx={linkSx}>
            <FiChevronRight size={14} aria-hidden="true" />
            {link.label}
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default function ClientFooter() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 3, md: 5 },
        borderTopLeftRadius: { xs: 24, md: 36 },
        borderTopRightRadius: { xs: 24, md: 36 },
        overflow: 'hidden',
        border: `1px solid ${alpha(BRAND.colors.teal, 0.1)}`,
        borderBottom: 0,
        background:
          'radial-gradient(circle at 15% 0%, rgba(217,230,247,0.58), transparent 36%), linear-gradient(180deg, #FFFFFF 0%, #F5F8FC 100%)',
        boxShadow: '0 -16px 50px rgba(6, 42, 91, 0.06)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1700px', px: { xs: 2.5, sm: 4, lg: 6 }, pt: { xs: 5, md: 6 }, pb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1.2fr) 1fr', lg: 'minmax(280px, 1.35fr) 0.9fr 0.9fr minmax(300px, 1.1fr)' },
            gap: { xs: 4, md: 5, lg: 7 },
            alignItems: 'start',
          }}
        >
          <Box>
            <Box component={RouterLink} to="/dashboard" aria-label={`${BRAND.name} dashboard`} sx={{ display: 'inline-flex' }}>
              <Box
                component="img"
                src={BRAND.logo}
                alt={BRAND.name}
                sx={{ width: { xs: 150, sm: 175 }, height: { xs: 96, sm: 110 }, objectFit: 'contain', objectPosition: 'left center' }}
              />
            </Box>
            <Typography sx={{ mt: 1.5, maxWidth: 390, color: BRAND.colors.muted, fontSize: '0.95rem', lineHeight: 1.9 }}>
              {BRAND.tagline} Smart shipping infrastructure for teams that need clearer courier rates, dependable tracking,
              and smoother delivery operations.
            </Typography>
            <Stack direction="row" spacing={1.25} sx={{ mt: 2.5 }}>
              <Tooltip title="Express Magic dashboard">
                <IconButton
                  component={RouterLink}
                  to="/dashboard"
                  aria-label="Open Express Magic dashboard"
                  sx={{ bgcolor: BRAND.colors.tealSoft, color: BRAND.colors.teal, '&:hover': { bgcolor: BRAND.colors.skySoft } }}
                >
                  <FiGlobe size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Email ${BRAND.supportEmail}`}>
                <IconButton
                  component="a"
                  href={`mailto:${BRAND.supportEmail}`}
                  aria-label={`Email ${BRAND.supportEmail}`}
                  sx={{ bgcolor: BRAND.colors.tealSoft, color: BRAND.colors.teal, '&:hover': { bgcolor: BRAND.colors.skySoft } }}
                >
                  <FiMail size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Call ${BRAND.supportPhoneDisplay}`}>
                <IconButton
                  component="a"
                  href={`tel:${BRAND.supportPhone}`}
                  aria-label={`Call ${BRAND.supportPhoneDisplay}`}
                  sx={{ bgcolor: BRAND.colors.tealSoft, color: BRAND.colors.teal, '&:hover': { bgcolor: BRAND.colors.skySoft } }}
                >
                  <FiPhone size={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <FooterLinks title="Platform" links={platformLinks} />
          <FooterLinks title="Company" links={companyLinks} />

          <Box>
            <Typography component="h2" sx={{ color: BRAND.colors.ink, fontSize: '1rem', fontWeight: 800, mb: 2 }}>
              Contact
            </Typography>
            <Stack spacing={1.5}>
              <Box component="a" href={`tel:${BRAND.supportPhone}`} sx={linkSx}>
                <FiPhone size={18} color={BRAND.colors.orange} />
                {BRAND.supportPhoneDisplay}
              </Box>
              <Box component="a" href={`mailto:${BRAND.supportEmail}`} sx={linkSx}>
                <FiMail size={18} color={BRAND.colors.orange} />
                {BRAND.supportEmail}
              </Box>
              <Box component="a" href={mapUrl} target="_blank" rel="noreferrer" sx={{ ...linkSx, alignItems: 'flex-start' }}>
                <FiMapPin size={18} color={BRAND.colors.orange} style={{ marginTop: 3 }} />
                <span>{BRAND.address}</span>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 5 }, pt: 2.5, borderTop: `1px solid ${alpha(BRAND.colors.teal, 0.12)}` }}>
          <Typography sx={{ color: BRAND.colors.muted, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
            © {new Date().getFullYear()} {BRAND.name}. Built for dependable logistics operations across India.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
