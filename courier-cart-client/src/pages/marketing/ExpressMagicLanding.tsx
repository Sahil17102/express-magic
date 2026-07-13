import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FiArrowDown,
  FiArrowRight,
  FiBox,
  FiCheck,
  FiClock,
  FiGlobe,
  FiPackage,
  FiSend,
  FiShield,
  FiTruck,
  FiZap,
} from 'react-icons/fi'
import { FaPlane, FaShip } from 'react-icons/fa'
import './ExpressMagicLanding.css'

gsap.registerPlugin(ScrollTrigger)

const SpaceLogisticsScene = lazy(() => import('./SpaceLogisticsScene'))

const networkStats = [
  { value: '27+', label: 'Carrier connections' },
  { value: '29K+', label: 'Serviceable pin codes' },
  { value: '99.2%', label: 'Tracking availability' },
  { value: '< 90 sec', label: 'Average label flow' },
]

const shipmentModes = [
  {
    code: '01 / GROUND',
    title: 'Road freight, tuned for every lane.',
    text: 'Surface, express, COD and hyperlocal services compared in a single decision layer.',
    icon: <FiTruck />,
    metric: '18,492',
    label: 'active routes',
  },
  {
    code: '02 / AIR',
    title: 'Priority movement when every hour matters.',
    text: 'Choose air partners using live serviceability, delivery promise and cost intelligence.',
    icon: <FaPlane />,
    metric: '1-2 days',
    label: 'metro delivery',
  },
  {
    code: '03 / GLOBAL',
    title: 'One network beyond the horizon.',
    text: 'Move international and multimodal shipments with a unified operational trail.',
    icon: <FaShip />,
    metric: '220+',
    label: 'territories',
  },
]

const missionSteps = [
  { number: '01', title: 'Orders in', text: 'Storefront, marketplace, CSV and API orders enter one clean queue.' },
  { number: '02', title: 'Best route found', text: 'Rate, SLA, weight and lane quality resolve the right courier.' },
  { number: '03', title: 'Dispatch cleared', text: 'AWB, label, manifest and pickup actions move without friction.' },
  { number: '04', title: 'Delivery protected', text: 'Live tracking and exception workflows keep every order visible.' },
]

const faqs = [
  ['Can I use my existing courier accounts?', 'Yes. Connect supported carrier accounts and manage them from the same Express Magic workspace.'],
  ['Does this change any existing app workflow?', 'No. Login, tracking, dashboard routes and every backend integration continue to work exactly as before.'],
  ['Where can customers track an order?', 'The public tracking experience remains available from the navigation and at /tracking.'],
]

export default function ExpressMagicLanding() {
  const pageRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'

    const context = gsap.context(() => {
      gsap.from('.em-hero__eyebrow, .em-hero h1, .em-hero__copy, .em-hero__actions, .em-hero__meta', {
        opacity: 0,
        y: 36,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.utils.toArray<HTMLElement>('.em-reveal').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 54,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true },
        })
      })

      gsap.to('.em-space-scene', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.em-hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })

      gsap.from('.em-mode', {
        opacity: 0,
        y: 70,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.em-modes', start: 'top 72%', once: true },
      })
    }, page)

    return () => {
      context.revert()
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    }
  }, [])

  return (
    <main className="em-landing" ref={pageRef}>
      <header className="em-nav">
        <a className="em-brand" href="/" aria-label="Express Magic home">
          <img src="/express-magic-logo.jpeg" alt="" />
          <span>EXPRESS MAGIC</span>
        </a>
        <nav className="em-nav__links" aria-label="Primary navigation">
          <a href="#network">Network</a>
          <a href="#services">Services</a>
          <a href="#operations">Operations</a>
        </nav>
        <div className="em-nav__actions">
          <a className="em-track-link" href="/tracking">Track order</a>
          <a className="em-button em-button--light" href="/login">Enter platform <FiArrowRight /></a>
        </div>
      </header>

      <section className="em-hero">
        <Suspense fallback={<div className="em-space-scene em-space-scene--loading" />}>
          <SpaceLogisticsScene />
        </Suspense>
        <div className="em-grid-overlay" />
        <div className="em-hero__content">
          <p className="em-hero__eyebrow"><span /> Mission control for modern commerce</p>
          <h1>Every shipment.<br /><em>In perfect orbit.</em></h1>
          <p className="em-hero__copy">
            One intelligent logistics network for rates, dispatch, tracking, exceptions and
            delivery performance across every carrier.
          </p>
          <div className="em-hero__actions">
            <a className="em-button em-button--signal" href="/login">Launch your shipments <FiArrowRight /></a>
            <a className="em-button em-button--ghost" href="/tracking"><FiPackage /> Track a package</a>
          </div>
          <div className="em-hero__meta">
            <span><FiGlobe /> Live across India</span>
            <span><FiShield /> Secure operations</span>
            <span><FiClock /> Always-on visibility</span>
          </div>
        </div>
        <a className="em-scroll-cue" href="#network" aria-label="Explore Express Magic">
          <span>EXPLORE</span><FiArrowDown />
        </a>
        <div className="em-orbit-status">
          <span className="em-status-dot" /> NETWORK ONLINE
          <strong>07:42:18 IST</strong>
        </div>
      </section>

      <section className="em-ticker" aria-label="Shipping services">
        <div>
          <span>GROUND EXPRESS</span><i>+</i><span>AIR CARGO</span><i>+</i><span>GLOBAL NETWORK</span><i>+</i><span>REAL-TIME TRACKING</span><i>+</i><span>SMARTER ROUTES</span><i>+</i>
          <span>GROUND EXPRESS</span><i>+</i><span>AIR CARGO</span><i>+</i><span>GLOBAL NETWORK</span><i>+</i><span>REAL-TIME TRACKING</span><i>+</i><span>SMARTER ROUTES</span><i>+</i>
        </div>
      </section>

      <section className="em-network" id="network">
        <div className="em-shell">
          <div className="em-section-heading em-reveal">
            <p className="em-label">THE NETWORK / 001</p>
            <h2>Logistics at a scale<br />you can finally control.</h2>
            <p>From checkout to doorstep, Express Magic turns fragmented courier operations into one precise system.</p>
          </div>
          <div className="em-network__stats em-reveal">
            {networkStats.map((stat) => (
              <article key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-command" id="operations">
        <div className="em-shell em-command__grid">
          <div className="em-command__copy em-reveal">
            <p className="em-label">MISSION CONTROL / LIVE</p>
            <h2>A calmer way to run a moving network.</h2>
            <p>Compare carriers, clear dispatches and act on exceptions from a single operational view.</p>
            <ul>
              <li><FiCheck /> Live courier rate and ETA comparison</li>
              <li><FiCheck /> AWB, labels, manifests and pickups</li>
              <li><FiCheck /> NDR, RTO and COD intelligence</li>
            </ul>
            <a className="em-text-action" href="/login">Explore the platform <FiArrowRight /></a>
          </div>
          <div className="em-console em-reveal" aria-label="Live shipment command center preview">
            <div className="em-console__top">
              <span><i /> COMMAND CENTER</span>
              <span>13 JUL 2026 / LIVE</span>
            </div>
            <div className="em-console__summary">
              <div><span>ORDERS IN MOTION</span><strong>8,420</strong><small>+12.8% today</small></div>
              <div className="em-console__radar"><span /><span /><span /><i /></div>
            </div>
            <div className="em-console__table">
              <div className="is-head"><span>SHIPMENT</span><span>ROUTE</span><span>STATUS</span><span>ETA</span></div>
              <div><span>EM-10482</span><span>DEL → BLR</span><span className="is-moving">IN TRANSIT</span><span>14 JUL</span></div>
              <div><span>EM-10476</span><span>MUM → HYD</span><span className="is-clear">OUT FOR DELIVERY</span><span>TODAY</span></div>
              <div><span>EM-10461</span><span>SUR → DEL</span><span className="is-alert">ACTION NEEDED</span><span>15 JUL</span></div>
            </div>
            <div className="em-console__footer"><FiZap /> 412 exceptions recovered automatically this week</div>
          </div>
        </div>
      </section>

      <section className="em-services" id="services">
        <div className="em-shell">
          <div className="em-section-heading em-section-heading--light em-reveal">
            <p className="em-label">MULTIMODAL / 002</p>
            <h2>One platform.<br />Every way forward.</h2>
          </div>
          <div className="em-modes">
            {shipmentModes.map((mode) => (
              <article className="em-mode" key={mode.code}>
                <div className="em-mode__top"><span>{mode.code}</span>{mode.icon}</div>
                <h3>{mode.title}</h3>
                <p>{mode.text}</p>
                <div className="em-mode__metric"><strong>{mode.metric}</strong><span>{mode.label}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-journey">
        <div className="em-shell">
          <div className="em-section-heading em-reveal">
            <p className="em-label">THE FLOW / 003</p>
            <h2>Four stages.<br />Zero blind spots.</h2>
          </div>
          <div className="em-journey__line">
            {missionSteps.map((step) => (
              <article className="em-reveal" key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="em-insight">
        <div className="em-insight__visual" aria-hidden="true">
          <span className="em-insight__ring em-insight__ring--one" />
          <span className="em-insight__ring em-insight__ring--two" />
          <span className="em-insight__core"><FiBox /></span>
          <span className="em-insight__route">DEL <i /> BLR <i /> MAA</span>
        </div>
        <div className="em-insight__copy em-reveal">
          <p className="em-label">VISIBILITY / 004</p>
          <h2>Know where every promise stands.</h2>
          <p>Operational signals become clear decisions before delay, cost or RTO risk reaches the customer.</p>
          <div className="em-insight__metrics">
            <div><strong>18%</strong><span>clearer cost visibility</span></div>
            <div><strong>42 hrs</strong><span>saved each month</span></div>
          </div>
        </div>
      </section>

      <section className="em-faq">
        <div className="em-shell em-faq__grid">
          <div className="em-section-heading em-reveal">
            <p className="em-label">GROUND CONTROL / 005</p>
            <h2>Answers before takeoff.</h2>
          </div>
          <div className="em-faq__list em-reveal">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span>+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="em-footer">
        <div className="em-footer__signal"><span /> READY FOR DISPATCH</div>
        <div className="em-footer__main">
          <p>THE NEXT MOVE IS YOURS</p>
          <h2>Ship beyond<br />the expected.</h2>
          <a className="em-button em-button--signal" href="/login">Launch Express Magic <FiSend /></a>
        </div>
        <div className="em-footer__bottom">
          <a className="em-brand" href="/"><img src="/express-magic-logo.jpeg" alt="" /><span>EXPRESS MAGIC</span></a>
          <span>Courier intelligence for modern commerce.</span>
          <div><a href="/tracking">Track</a><a href="/login">Login</a></div>
        </div>
      </footer>
    </main>
  )
}
