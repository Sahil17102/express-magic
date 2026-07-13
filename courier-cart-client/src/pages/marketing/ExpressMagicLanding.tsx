import {
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMenu,
  FiPackage,
  FiShield,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import './ExpressMagicLanding.css'

const heroFeatures = [
  {
    title: 'Smart Dispatch',
    text: 'Automate courier choice and reduce manual effort.',
    icon: <FiBox />,
    tone: 'rose',
  },
  {
    title: 'Real-time Tracking',
    text: 'Track every shipment with live movement clarity.',
    icon: <FiPackage />,
    tone: 'blue',
  },
  {
    title: 'Exception Management',
    text: 'Spot issues early and resolve them faster.',
    icon: <FiShield />,
    tone: 'green',
  },
  {
    title: 'Performance Analytics',
    text: 'See courier, cost, and delivery performance at a glance.',
    icon: <FiBarChart2 />,
    tone: 'violet',
  },
]

const scaleStats = [
  { value: '25M+', label: 'Shipments Delivered', icon: <FiBox />, tone: 'blue' },
  { value: '98.6%', label: 'On-time Delivery', icon: <FiClock />, tone: 'green' },
  { value: '27K+', label: 'Happy Clients', icon: <FiUsers />, tone: 'orange' },
]

const workflowCards = [
  {
    title: 'Rate Intelligence',
    text: 'Compare courier pricing, ETA, COD readiness, and serviceability before booking.',
    icon: <FiBarChart2 />,
  },
  {
    title: 'Label Automation',
    text: 'Generate AWB, labels, manifests, and pickup actions from one order queue.',
    icon: <FiPackage />,
  },
  {
    title: 'Delivery Recovery',
    text: 'Catch NDR, RTO, and stuck-shipment issues earlier with clear exception workflows.',
    icon: <FiShield />,
  },
]

const routeRows = [
  ['EM-10482', 'Delhi to Bengaluru', 'In Transit', '14 Jul'],
  ['EM-10476', 'Mumbai to Hyderabad', 'Out for delivery', 'Today'],
  ['EM-10461', 'Surat to Delhi', 'Action needed', '15 Jul'],
]

export default function ExpressMagicLanding() {
  return (
    <main className="em-landing">
      <header className="em-nav">
        <a className="em-brand" href="/" aria-label="Express Magic home">
          <img src="/express-magic-logo.jpeg" alt="Express Magic" />
        </a>

        <nav className="em-nav__links" aria-label="Primary navigation">
          <a href="/tracking">Tracking</a>
          <a href="/weight-calculator">Weight Calculator</a>
          <a href="/rate-calculator">Rate Calculator</a>
        </nav>

        <div className="em-nav__actions">
          <a className="em-platform-button" href="/login">
            <span>Enter platform</span> <FiArrowRight />
          </a>
          <button className="em-menu-button" type="button" aria-label="Open navigation">
            <FiMenu />
          </button>
        </div>
      </header>

      <section className="em-hero" id="solutions">
        <div className="em-hero__media" aria-hidden="true" />
        <div className="em-hero__content">
          <p className="em-hero__eyebrow">
            <FiCheckCircle /> Mission Control for Modern Commerce
          </p>
          <h1>
            From
            <br />
            warehouse.
            <br />
            <span>To every</span>
            <br />
            <span>doorstep.</span>
          </h1>
          <p className="em-hero__copy">
            One intelligent logistics network for rates, dispatch, tracking, exceptions and
            delivery performance across every carrier.
          </p>
          <div className="em-hero__actions">
            <a className="em-button em-button--primary" href="/login">
              <span>Launch your shipments</span> <FiArrowRight />
            </a>
            <a className="em-button em-button--secondary" href="/tracking">
              <FiPackage /> Track a package
            </a>
          </div>
        </div>

        <div className="em-feature-strip" aria-label="Express Magic platform features">
          {heroFeatures.map((feature) => (
            <article key={feature.title}>
              <span className={`em-feature-icon is-${feature.tone}`}>{feature.icon}</span>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="em-scale" id="pricing">
        <div className="em-shell em-scale__grid">
          <div className="em-scale__copy">
            <p className="em-section-label">Built for scale</p>
            <h2>Powering logistics that deliver more.</h2>
            <p>
              Our platform connects you with a wide network of carriers and tools to simplify
              operations, reduce delivery guesswork, and delight your customers.
            </p>
            <div className="em-scale__stats">
              {scaleStats.map((stat) => (
                <article key={stat.label}>
                  <span className={`em-stat-icon is-${stat.tone}`}>{stat.icon}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="em-dashboard-card">
            <div className="em-metric-grid">
              <article>
                <p>Shipments Delivered</p>
                <strong>24.5M</strong>
                <span>+ 12.5%</span>
                <small>This month</small>
              </article>
              <article>
                <p>On-time Delivery</p>
                <strong>98.6%</strong>
                <span>+ 4.3%</span>
                <small>This month</small>
              </article>
            </div>

            <div className="em-live-map">
              <div className="em-live-map__top">
                <h3>Live Tracking</h3>
                <span>Live</span>
              </div>
              <div className="em-map-canvas">
                <svg viewBox="0 0 560 240" fill="none" aria-hidden="true">
                  <path
                    d="M46 165 L98 146 L144 162 L214 118 L286 154 L356 96 L432 106 L504 70"
                    stroke="#2563EB"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[46, 144, 214, 356, 432, 504].map((cx, index) => (
                    <circle
                      key={cx}
                      cx={cx}
                      cy={[165, 162, 118, 96, 106, 70][index]}
                      r="11"
                      fill="#2563EB"
                      stroke="white"
                      strokeWidth="6"
                    />
                  ))}
                </svg>
                <span className="em-map-truck">
                  <FiTruck />
                </span>
                <div className="em-map-status">
                  <strong>Out for delivery</strong>
                  <small>Mumbai, MH</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="em-services" id="services">
        <div className="em-shell">
          <div className="em-section-heading">
            <p className="em-section-label">Services</p>
            <h2>Cleaner shipping decisions from checkout to doorstep.</h2>
            <a href="/login">Start shipping <FiArrowRight /></a>
          </div>
          <div className="em-workflow-grid">
            {workflowCards.map((card) => (
              <article key={card.title}>
                <span>{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-operations" id="resources">
        <div className="em-shell em-operations__grid">
          <div>
            <p className="em-section-label">Operations</p>
            <h2>A calmer way to run a moving network.</h2>
            <p>
              Compare carriers, clear dispatches, and act on delivery exceptions from a single
              operational view that your team can use every day.
            </p>
            <ul>
              <li><FiCheckCircle /> Live courier rate and ETA comparison</li>
              <li><FiCheckCircle /> AWB, labels, manifests and pickups</li>
              <li><FiCheckCircle /> NDR, RTO and COD intelligence</li>
            </ul>
          </div>
          <div className="em-command-card">
            <div className="em-command-card__top">
              <span>Command Center</span>
              <span>Live</span>
            </div>
            <div className="em-command-card__summary">
              <span>Orders in motion</span>
              <strong>8,420</strong>
              <small>+12.8% today</small>
            </div>
            <div className="em-command-table">
              {routeRows.map(([id, route, status, eta]) => (
                <div key={id}>
                  <span>{id}</span>
                  <span>{route}</span>
                  <strong>{status}</strong>
                  <small>{eta}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="em-footer" id="about">
        <div>
          <img src="/express-magic-logo.jpeg" alt="Express Magic" />
          <p>Courier intelligence for modern commerce.</p>
        </div>
        <a className="em-button em-button--primary" href="/login">
          Launch Express Magic <FiArrowRight />
        </a>
      </footer>
    </main>
  )
}
