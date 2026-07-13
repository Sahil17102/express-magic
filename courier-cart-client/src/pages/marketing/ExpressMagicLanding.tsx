import {
  FiActivity,
  FiArrowRight,
  FiBell,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiCreditCard,
  FiDatabase,
  FiGlobe,
  FiGrid,
  FiHeadphones,
  FiLayers,
  FiMapPin,
  FiPackage,
  FiRepeat,
  FiShield,
  FiShoppingBag,
  FiSliders,
  FiTruck,
  FiZap,
} from 'react-icons/fi'
import './ExpressMagicLanding.css'

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Rates', href: '#rates' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Insights', href: '#insights' },
]

const heroStats = [
  { value: '27+', label: 'Courier partners' },
  { value: '29K+', label: 'Pin codes covered' },
  { value: '99.2%', label: 'Tracking uptime' },
]

const carrierRows = [
  { name: 'Delhivery', lane: 'Surface', rate: 'Rs 64', eta: '2-4 days', score: '94%' },
  { name: 'Blue Dart', lane: 'Air', rate: 'Rs 112', eta: '1-2 days', score: '91%' },
  { name: 'XpressBees', lane: 'COD', rate: 'Rs 72', eta: '3-5 days', score: '89%' },
]

const proofItems = [
  { label: 'Orders synced today', value: '8,420', icon: <FiShoppingBag /> },
  { label: 'Labels generated', value: '6,980', icon: <FiPackage /> },
  { label: 'Exceptions recovered', value: '412', icon: <FiRepeat /> },
  { label: 'COD visibility', value: 'Live', icon: <FiCreditCard /> },
]

const platformCards = [
  {
    title: 'Unified shipping desk',
    text: 'Bring marketplace, website, and manual orders into one dispatch queue.',
    icon: <FiGrid />,
  },
  {
    title: 'Courier decision layer',
    text: 'Compare rate, SLA, serviceability, COD support, and lane strength.',
    icon: <FiSliders />,
  },
  {
    title: 'Tracking command center',
    text: 'Give support teams and buyers a single shipment timeline they can trust.',
    icon: <FiMapPin />,
  },
  {
    title: 'Recovery workflows',
    text: 'Prioritize NDR, RTO, retry, and customer follow-up without spreadsheets.',
    icon: <FiShield />,
  },
  {
    title: 'Automation rules',
    text: 'Apply courier rules by zone, weight, value, service mode, and priority.',
    icon: <FiCpu />,
  },
  {
    title: 'Team-ready operations',
    text: 'Keep pickups, labels, manifests, and reports structured for repeat work.',
    icon: <FiLayers />,
  },
]

const integrations = [
  'Shopify',
  'WooCommerce',
  'Amazon',
  'Flipkart',
  'Magento',
  'Wix',
  'Manual CSV',
  'API',
]

const workflowSteps = [
  {
    title: 'Capture demand',
    text: 'Collect store, marketplace, and manual orders into a clean shipment queue.',
    icon: <FiDatabase />,
  },
  {
    title: 'Choose the right courier',
    text: 'Operators compare rate, lane quality, COD readiness, and delivery promise.',
    icon: <FiTruck />,
  },
  {
    title: 'Dispatch without delay',
    text: 'Generate AWB, labels, manifests, and pickup actions from one screen.',
    icon: <FiZap />,
  },
  {
    title: 'Protect delivery outcomes',
    text: 'Track exceptions, NDR actions, retry status, and customer communication.',
    icon: <FiBell />,
  },
]

const analytics = [
  { value: '18%', label: 'Cost visibility gain' },
  { value: '42 hrs', label: 'Ops time saved monthly' },
  { value: '6.8%', label: 'RTO risk surfaced' },
]

const faqs = [
  {
    q: 'Can Express Magic show the landing page on the Railway domain?',
    a: 'Yes. The public root route now serves this landing page, while dashboard login stays available at /login.',
  },
  {
    q: 'Will this change backend APIs?',
    a: 'No. This page is frontend-only and keeps the existing app routes, login, tracking, and backend integrations intact.',
  },
  {
    q: 'Can sellers still login directly?',
    a: 'Yes. Every primary call-to-action points to /login, and protected app routes redirect there automatically.',
  },
]

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <div className="em-section-head">
      <p className="em-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  )
}

export default function ExpressMagicLanding() {
  return (
    <main className="em-landing">
      <header className="em-nav">
        <div className="em-shell em-nav__inner">
          <a className="em-brand" href="/">
            <img src="/express-magic-logo.jpeg" alt="Express Magic" />
            <span>Express Magic</span>
          </a>
          <nav className="em-nav__links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="em-nav__actions">
            <a className="em-text-link" href="/tracking">
              Track
            </a>
            <a className="em-button em-button--dark" href="/login">
              Login <FiArrowRight />
            </a>
          </div>
        </div>
      </header>

      <section className="em-hero">
        <div className="em-shell em-hero__grid">
          <div className="em-hero__copy">
            <p className="em-kicker">Shipping OS for growing commerce teams</p>
            <h1>
              Move every order with
              <span> courier-grade control.</span>
            </h1>
            <p>
              Express Magic turns scattered shipping work into one sharp operating system for
              rates, labels, tracking, NDR, COD, and delivery performance.
            </p>
            <div className="em-hero__actions">
              <a className="em-button em-button--red" href="/login">
                Start shipping <FiArrowRight />
              </a>
              <a className="em-button em-button--light" href="/tracking">
                Track shipment
              </a>
            </div>
            <div className="em-stats">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="em-hero-card" aria-label="Express Magic rate and dispatch preview">
            <div className="em-hero-card__top">
              <span>Live rate engine</span>
              <strong>Today</strong>
            </div>
            <div className="em-map">
              <span className="em-map__pin em-map__pin--one">SUR</span>
              <span className="em-map__pin em-map__pin--two">DEL</span>
              <span className="em-map__pin em-map__pin--three">BLR</span>
              <svg viewBox="0 0 420 210" aria-hidden="true">
                <path d="M36 144 C112 62 186 118 246 72 C306 26 350 72 390 38" />
                <path d="M54 170 C140 126 184 178 250 136 C306 98 340 130 380 102" />
              </svg>
            </div>
            <div className="em-carrier-list">
              {carrierRows.map((row) => (
                <div className="em-carrier-row" key={row.name}>
                  <span className="em-carrier-mark">{row.name.slice(0, 2)}</span>
                  <span>
                    <strong>{row.name}</strong>
                    <small>
                      {row.lane} - {row.eta}
                    </small>
                  </span>
                  <span>
                    <strong>{row.rate}</strong>
                    <small>{row.score} fit</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="em-proof-band">
        <div className="em-shell em-proof-band__grid">
          {proofItems.map((item) => (
            <article key={item.label}>
              {item.icon}
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="em-section" id="platform">
        <div className="em-shell">
          <SectionHeader
            eyebrow="Platform depth"
            title="A full logistics workspace, not just a landing screen."
            text="The page now gives sellers enough substance to explore, compare, trust, and take action before they login."
          />
          <div className="em-card-grid">
            {platformCards.map((card) => (
              <article className="em-feature-card" key={card.title}>
                {card.icon}
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-section em-section--split" id="rates">
        <div className="em-shell em-split">
          <div>
            <SectionHeader
              eyebrow="Rate confidence"
              title="Compare the best courier before every dispatch."
              text="Operators can see available courier fit, price movement, serviceability, and risk signals before committing to an AWB."
            />
            <div className="em-check-list">
              {['Rate and ETA comparison', 'COD and value checks', 'Zone and weight logic'].map(
                (item) => (
                  <span key={item}>
                    <FiCheckCircle /> {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="em-rate-panel">
            <div className="em-rate-panel__head">
              <span>Courier recommendation</span>
              <strong>Best value</strong>
            </div>
            {carrierRows.map((row, index) => (
              <div className="em-rate-line" key={row.name}>
                <div>
                  <strong>{row.name}</strong>
                  <small>
                    {row.rate} - {row.eta}
                  </small>
                </div>
                <span style={{ width: `${92 - index * 10}%` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="em-section em-section--ink">
        <div className="em-shell em-integrations">
          <div>
            <p className="em-kicker">Integrations</p>
            <h2>Channels, marketplaces, CSV, and APIs in one intake layer.</h2>
          </div>
          <div className="em-integration-grid">
            {integrations.map((item, index) => (
              <span key={item} className={index % 3 === 0 ? 'is-hot' : undefined}>
                <FiGlobe /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="em-section" id="workflow">
        <div className="em-shell">
          <SectionHeader
            eyebrow="Operating flow"
            title="A longer, clearer journey from order sync to delivery recovery."
            text="Each stage is designed around daily operations teams who need speed, clarity, and fewer manual checks."
          />
          <div className="em-timeline">
            {workflowSteps.map((step, index) => (
              <article key={step.title}>
                <span className="em-timeline__number">0{index + 1}</span>
                {step.icon}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-section em-section--split" id="insights">
        <div className="em-shell em-split em-split--reverse">
          <div className="em-analytics-card">
            <div className="em-analytics-card__chart">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="em-analytics-card__rows">
              {analytics.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader
              eyebrow="Insights"
              title="Turn shipping data into cleaner operational decisions."
              text="Cost trends, stuck shipments, courier reliability, COD movement, and RTO signals become easier to scan before they become expensive."
            />
            <a className="em-button em-button--dark" href="/login">
              Open dashboard <FiArrowRight />
            </a>
          </div>
        </div>
      </section>

      <section className="em-section">
        <div className="em-shell em-support">
          <div>
            <p className="em-kicker">Support ready</p>
            <h2>Launch with practical help, not another complicated portal.</h2>
            <p>
              Get guided setup for channels, pickup points, courier rules, manifests, tracking, and
              exception playbooks.
            </p>
          </div>
          <div className="em-support__cards">
            <article>
              <FiHeadphones />
              <strong>Onboarding help</strong>
              <span>Setup support before your first live shipment.</span>
            </article>
            <article>
              <FiClock />
              <strong>Daily operations</strong>
              <span>Cleaner queues for fast-moving dispatch teams.</span>
            </article>
            <article>
              <FiActivity />
              <strong>Scale reviews</strong>
              <span>Review courier mix as shipment volume grows.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="em-section em-faq-section">
        <div className="em-shell">
          <SectionHeader
            eyebrow="Questions"
            title="Clear answers before sellers enter the app."
          />
          <div className="em-faq-grid">
            {faqs.map((faq) => (
              <article key={faq.q}>
                <FiBox />
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="em-footer">
        <div className="em-shell em-footer__grid">
          <div>
            <img src="/express-magic-logo.jpeg" alt="" />
            <h2>Ready to make shipping feel under control?</h2>
            <p>Open the dashboard, connect orders, and start moving shipments with confidence.</p>
          </div>
          <div className="em-footer__actions">
            <a className="em-button em-button--red" href="/login">
              Login to dashboard <FiArrowRight />
            </a>
            <a className="em-button em-button--footer" href="/tracking">
              Track shipment
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
