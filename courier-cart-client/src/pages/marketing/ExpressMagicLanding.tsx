import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiMapPin,
  FiPackage,
  FiRepeat,
  FiShield,
  FiTruck,
  FiZap,
} from 'react-icons/fi'
import './ExpressMagicLanding.css'

const proofItems = [
  { value: '27+', label: 'Courier partners' },
  { value: '29K+', label: 'Serviceable pin codes' },
  { value: '24/7', label: 'Shipment visibility' },
]

const dashboardRows = [
  {
    title: 'Orders synced',
    detail: 'Shopify, WooCommerce, marketplaces',
    status: 'Live',
    icon: <FiPackage />,
  },
  {
    title: 'Courier matched',
    detail: 'Rate, lane, COD and SLA checked',
    status: 'Ready',
    icon: <FiTruck />,
  },
  {
    title: 'Tracking updated',
    detail: 'Customer timeline and support view',
    status: 'Active',
    icon: <FiMapPin />,
  },
]

const features = [
  {
    title: 'Multi-courier booking',
    text: 'Compare courier options and move shipments from one operating screen.',
    icon: <FiTruck />,
  },
  {
    title: 'Smart rate visibility',
    text: 'Understand cost, delivery promise, and serviceability before dispatch.',
    icon: <FiBarChart2 />,
  },
  {
    title: 'Live tracking',
    text: 'Give teams and customers a clear view from booking to final delivery.',
    icon: <FiMapPin />,
  },
  {
    title: 'Exception control',
    text: 'Handle NDR, RTO, retries, and customer follow-up before delays pile up.',
    icon: <FiRepeat />,
  },
]

const workflow = [
  {
    title: 'Connect channels',
    text: 'Bring ecommerce stores, marketplaces, and manual orders into one queue.',
    icon: <FiZap />,
  },
  {
    title: 'Dispatch confidently',
    text: 'Generate labels, manifests, and courier assignments without switching portals.',
    icon: <FiCheckCircle />,
  },
  {
    title: 'Recover faster',
    text: 'Keep delivery exceptions visible with practical follow-up actions.',
    icon: <FiShield />,
  },
]

export default function ExpressMagicLanding() {
  return (
    <main className="em-landing">
      <header className="em-landing__nav">
        <div className="em-landing__nav-inner">
          <a className="em-landing__brand" href="/">
            <img className="em-landing__logo" src="/express-magic-logo.jpeg" alt="Express Magic" />
            <span>Express Magic</span>
          </a>
          <nav className="em-landing__nav-actions" aria-label="Primary navigation">
            <a className="em-landing__link" href="/tracking">
              Track order
            </a>
            <a className="em-landing__button em-landing__button--primary" href="/login">
              Login <FiArrowRight />
            </a>
          </nav>
        </div>
      </header>

      <section className="em-landing__hero">
        <div>
          <p className="em-landing__eyebrow">Shipping OS for growing sellers</p>
          <h1 className="em-landing__title">
            Ship faster across every channel.
            <span className="em-landing__title-accent">Control every delivery.</span>
          </h1>
          <p className="em-landing__copy">
            Express Magic brings orders, courier selection, labels, tracking, and exception
            recovery into one clean workspace for everyday shipping teams.
          </p>
          <div className="em-landing__hero-actions">
            <a className="em-landing__button em-landing__button--primary" href="/login">
              Start shipping <FiArrowRight />
            </a>
            <a className="em-landing__button em-landing__button--secondary" href="/tracking">
              Track shipment
            </a>
          </div>
          <div className="em-landing__proof" aria-label="Express Magic platform highlights">
            {proofItems.map((item) => (
              <div className="em-landing__proof-card" key={item.label}>
                <span className="em-landing__proof-value">{item.value}</span>
                <span className="em-landing__proof-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="em-landing__visual" aria-label="Express Magic workspace preview">
          <div className="em-landing__dashboard">
            <div className="em-landing__dashboard-head">
              <div>
                <p className="em-landing__dashboard-title">Today&apos;s dispatch queue</p>
                <p className="em-landing__dashboard-subtitle">Orders, couriers and tracking in sync</p>
              </div>
              <span className="em-landing__status">Operational</span>
            </div>
            <div className="em-landing__rows">
              {dashboardRows.map((row) => (
                <div className="em-landing__row" key={row.title}>
                  <span className="em-landing__row-icon">{row.icon}</span>
                  <span>
                    <span className="em-landing__row-title">{row.title}</span>
                    <span className="em-landing__row-text">{row.detail}</span>
                  </span>
                  <span className="em-landing__row-pill">{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="em-landing__section">
        <div className="em-landing__section-head">
          <div>
            <p className="em-landing__eyebrow">Built for daily shipping</p>
            <h2>Modern logistics tools without the portal chaos.</h2>
          </div>
          <a className="em-landing__button em-landing__button--secondary" href="/login">
            Open dashboard
          </a>
        </div>
        <div className="em-landing__features">
          {features.map((feature) => (
            <article className="em-landing__feature" key={feature.title}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="em-landing__section">
        <div className="em-landing__section-head">
          <div>
            <p className="em-landing__eyebrow">Operating flow</p>
            <h2>A cleaner path from order sync to delivery recovery.</h2>
          </div>
        </div>
        <div className="em-landing__workflow">
          {workflow.map((item) => (
            <article className="em-landing__workflow-card" key={item.title}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="em-landing__footer">
        <div className="em-landing__footer-inner">
          <div>
            <strong>Express Magic</strong>
            <p>Reliable shipping operations for growing commerce teams.</p>
          </div>
          <a className="em-landing__button em-landing__button--primary" href="/login">
            Login to dashboard <FiArrowRight />
          </a>
        </div>
      </footer>
    </main>
  )
}
