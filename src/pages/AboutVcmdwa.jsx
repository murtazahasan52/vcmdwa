import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { useEventConfig } from "../hooks/useEventConfig";

const objectives = [
  { icon: "users", title: "For members & the trade", items: ["Curb unfair trade practices among computer and media dealers", "Settle disputes between members through mediation", "Promote members' innovative products and services", "Build fellowship among Vidarbha dealers"] },
  { icon: "heart", title: "For consumers", items: ["Teach users the benefits of information technology", "Raise awareness of new IT products, services and practices", "Ensure fair prices for products and services"] },
  { icon: "spark", title: "For society", items: ["Annual blood donation camps", "Computer and monetary donations to orphanages and the disadvantaged", "Cyber awareness, digital literacy and e-waste management"] },
];

export default function AboutVcmdwa() {
  const { config } = useEventConfig();
  const a = config.association || {};

  return (
    <>
      <section className="section page-hero-tech">
        <div className="container">
          <div className="eyebrow">About the Organiser</div>
          <h1 className="page-title">{a.name || "Vidarbha Computer & Media Dealers' Welfare Association"}</h1>
          <p className="lead">
            VCMDWA is the association of leading IT dealers and service providers of the Vidarbha region, based at
            Bajaj Nagar, Nagpur. It protects its members&rsquo; interests, promotes ethical and transparent trade, and
            organises COMP-EX &mdash; Central India&rsquo;s largest IT exhibition.
          </p>
          <div className="about-facts">
            <div className="about-fact"><strong>{a.founded || "1991"}</strong><span>Established</span></div>
            <div className="about-fact"><strong>135</strong><span>Members (101 full · 34 associate)</span></div>
            <div className="about-fact"><strong>FAIITA · FITAM</strong><span>Affiliations</span></div>
            <div className="about-fact"><strong>Best IT Association</strong><span>DQ Week award</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow">What VCMDWA does</div>
            <h2>Business, customers and society</h2>
          </Reveal>
          <div className="grid grid-3">
            {objectives.map((o, i) => (
              <Reveal key={o.title} delay={i * 90}>
                <div className="card feature-card">
                  <div className="icon-badge icon-badge-lg"><Icon name={o.icon} size={26} /></div>
                  <h3>{o.title}</h3>
                  <ul className="tick-list">
                    {o.items.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="card about-expo-card" style={{ marginTop: 32 }}>
            <p>
              VCMDWA launched the <strong>VCMDWA Assured Partner (VAP)</strong> program in February 2016, runs regular
              seminars on management, marketing, HR and finance, and sponsors members&rsquo; visits to international IT
              expos in Dubai, China and Taiwan &mdash; members return and share what they learned.
            </p>
            <p style={{ marginBottom: 0 }}>
              COMP-EX is run in-house by member-led committees. Members get first preference for stall space before
              general exhibitors &mdash; see the <Link to="/register/exhibitor">VCMDWA Member Stalls</Link> on the rate card.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Executive Team</div>
            <h2>The people behind COMP-EX</h2>
          </Reveal>
          <div className="team-grid">
            {(a.team || []).map((t) => (
              <div className="card team-card" key={t.name}>
                <div className="team-avatar">{t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                <div className="team-name">{t.name}</div>
                <div className="team-post">{t.post}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Contact VCMDWA</h2>
          <p className="lead" style={{ margin: "0 auto 20px" }}>{a.address}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={`tel:${(config.contact?.phone || "").replace(/[^\d+]/g, "")}`}>
              <Icon name="phone" size={16} /> {config.contact?.phone}
            </a>
            <a className="btn btn-outline" href={`mailto:${config.contact?.email}`}>
              <Icon name="mail" size={16} /> {config.contact?.email}
            </a>
            {a.website && (
              <a className="btn btn-outline" href={a.website} target="_blank" rel="noreferrer">vcmdwa.org</a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
