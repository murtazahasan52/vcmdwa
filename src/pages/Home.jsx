import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ExhibitorMarquee from "../components/ExhibitorMarquee";
import CategoryGrid from "../components/CategoryGrid";
import StatsBar from "../components/StatsBar";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import { useEventConfig } from "../hooks/useEventConfig";

const exhibitBenefits = [
  { icon: "users", title: "Lakhs of IT Buyers", desc: "Home users, students, SOHO and corporate buyers, dealers and resellers from across Central India walk through COMP-EX." },
  { icon: "monitor", title: "Launch & Demo Live", desc: "Launch new products, run live demos and build your brand in front of the region&rsquo;s biggest tech crowd." },
  { icon: "spark", title: "Leads That Last", desc: "Four full days of footfall, plus a year-round listing in the Digital COMP-EX Directory." },
];

const visitBenefits = [
  { icon: "store", title: "Every Brand, One Roof", desc: "Laptops, printers, CCTV, networking, mobiles, gaming and AI &mdash; compare and buy at expo offers." },
  { icon: "ticket", title: "Free QR Entry Pass", desc: "Register once and get your personal QR pass by e-mail and WhatsApp &mdash; just scan at the gate." },
  { icon: "cap", title: "Learn & Grow", desc: "Seminars, career guidance for students, startup showcases and cyber-awareness sessions with Nagpur Police." },
];

const pastBrands = ["HP", "Dell", "Lenovo", "Acer", "Asus", "Samsung", "Canon", "Epson", "Brother", "Microsoft", "Intel", "D-Link", "Digisol", "Tally", "Panasonic", "BenQ"];

function BenefitGrid({ items }) {
  return (
    <div className="grid grid-3">
      {items.map((b, i) => (
        <Reveal key={b.title} delay={i * 90}>
          <div className="card feature-card">
            <div className="icon-badge icon-badge-lg">
              <Icon name={b.icon} size={28} />
            </div>
            <h3>{b.title}</h3>
            <p style={{ marginBottom: 0, fontSize: 14.5 }} dangerouslySetInnerHTML={{ __html: b.desc }} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  const { config } = useEventConfig();
  const mp = config.mediaPartner || {};

  const stats = [
    { label: "Editions", value: "32" },
    { label: "Visitors (past editions)", value: "2.5 Lakh+" },
    { label: "Brands", value: "200+" },
    { label: "Show Days", value: config.showDays || "4" },
  ];

  return (
    <>
      <Hero />

      <section className="section stats-section">
        <div className="container">
          <div className="stats-panel">
            <StatsBar stats={stats} />
          </div>
        </div>
      </section>

      <ExhibitorMarquee />

      <section className="section section-alt" id="about">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
              <div className="eyebrow">About COMP-EX</div>
              <h2>Central India&rsquo;s biggest stage for technology</h2>
              <p className="lead" style={{ margin: "0 auto" }}>
                COMP-EX is the flagship B2C IT exhibition of VCMDWA, held every year in Nagpur &mdash; COMP-EX 2027 is
                the 33rd edition.
              </p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="card about-expo-card">
              <p>
                <strong>COMP-EX 2027</strong> brings together leading national and international IT brands, distributors,
                dealers, system integrators, software companies and startups. Visitors explore the latest laptops and
                desktops, printers and copiers, CCTV and surveillance, networking, cybersecurity, cloud and AI,
                mobiles and accessories, and a high-powered Gaming Zone.
              </p>
              <p>
                Past editions drew around <strong>2.5 lakh visitors</strong> and <strong>200+ brands</strong>, with
                Maharashtra Chief Minister Devendra Fadnavis among the chief guests, and the Government of Maharashtra
                and Maha-Metro as associate partners.
              </p>
              <p style={{ marginBottom: 0 }}>
                Beyond paid brand showcasing, COMP-EX runs <strong>technology seminars, career guidance for students,
                startup showcases, cyber-awareness programs with the Nagpur Police</strong> and e-Governance
                initiatives &mdash; a platform that empowers MSMEs, startups and young talent across Vidarbha.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-3" style={{ marginTop: 36 }}>
            {(config.highlights || []).slice(0, 6).map((h, i) => (
              <Reveal key={h} delay={i * 70}>
                <div className="card highlight-card">
                  <Icon name="check" size={18} />
                  <span>{h}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Brands at Past Editions</div>
            <h2>Where the biggest names in IT meet Nagpur</h2>
          </Reveal>
          <div className="brand-chip-row">
            {pastBrands.map((b) => (
              <span className="brand-chip" key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Why Exhibit</div>
            <h2>Put your brand in front of Central India</h2>
          </Reveal>
          <BenefitGrid items={exhibitBenefits} />
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link to="/register/exhibitor" className="btn btn-primary">
              Book a Stall on the Live Map
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Why Visit</div>
            <h2>Discover {config.totalStalls} stalls of the latest tech</h2>
          </Reveal>
          <BenefitGrid items={visitBenefits} />
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link to="/register/visitor" className="btn btn-primary">
              Get Your Free Visitor Pass
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="categories">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Expo Categories</div>
            <h2>Everything IT, under one roof</h2>
            <p className="lead" style={{ marginBottom: 36 }}>
              From hardware and peripherals to cybersecurity, cloud and AI &mdash; explore every corner of the tech
              world at COMP-EX 2027.
            </p>
          </Reveal>
          <CategoryGrid categories={config.categories || []} />
        </div>
      </section>

      <section className="section directory-promo">
        <div className="container directory-promo-inner">
          <Reveal>
            <div className="eyebrow">New for 2027</div>
            <h2>The Digital COMP-EX Directory</h2>
            <p className="lead">
              Every exhibitor and brand in one searchable directory &mdash; stall number, products, phone, WhatsApp and
              directions. Live during the expo and online all year. <strong>Fully owned by COMP-EX / VCMDWA.</strong>
            </p>
            <div className="hero-ctas" style={{ justifyContent: "flex-start" }}>
              <Link to="/directory" className="btn btn-primary">
                <Icon name="users" size={18} /> Open the Directory
              </Link>
              <Link to="/stalls" className="btn btn-outline">
                <Icon name="mapPin" size={18} /> Live Stall Map
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Partners</div>
            <h2>Organisers &amp; partners</h2>
          </Reveal>
          <div className="partner-grid">
            <div className="card partner-card">
              <div className="partner-tier">Organised by</div>
              <div className="partner-name">VCMDWA</div>
              <div className="partner-sub">Vidarbha Computer &amp; Media Dealers&rsquo; Welfare Association, Nagpur</div>
            </div>
            <div className="card partner-card">
              <div className="partner-tier">Associate Partners (past editions)</div>
              <div className="partner-name">Govt. of Maharashtra · Maha-Metro</div>
              <div className="partner-sub">e-Governance &amp; smart-city showcases</div>
            </div>
            <div className="card partner-card partner-card-accent">
              <div className="partner-tier">Media Partner</div>
              <div className="partner-name">{mp.name || "Hayat Computers & Security Solutions"}</div>
              <div className="partner-sub">{mp.role || "Online platform & Digital Directory"} · {mp.city || "Nagpur"}</div>
            </div>
            <div className="card partner-card partner-card-empty">
              <div className="partner-tier">Title Sponsor</div>
              <div className="partner-name">Your brand here</div>
              <div className="partner-sub">Sponsorship: {config.contact?.phone}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="eyebrow">Join Us</div>
            <h2>See you at COMP-EX 2027</h2>
            <p className="lead" style={{ margin: "0 auto 32px" }}>
              Stalls are allotted first come, first served &mdash; VCMDWA members get first preference. Book yours or
              grab your free visitor pass today.
            </p>
            <div className="hero-ctas">
              <Link to="/register/exhibitor" className="btn btn-primary">
                Book a Stall
              </Link>
              <Link to="/register/visitor" className="btn btn-outline">
                Free Visitor Pass
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
