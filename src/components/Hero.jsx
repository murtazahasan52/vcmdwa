import { Link } from "react-router-dom";
import Icon from "./Icon";
import CountdownTimer from "./CountdownTimer";
import { useEventConfig } from "../hooks/useEventConfig";

export default function Hero() {
  const { config } = useEventConfig();
  const mp = config.mediaPartner || {};

  return (
    <section className="hero hero-tech">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-edition fade-up-1">{config.eventEdition || "33rd Edition"} · Organised by VCMDWA</div>
        <h1 className="hero-wordmark fade-up-2" aria-label="COMP-EX 2027">
          COMP<span className="hero-wordmark-accent">-EX</span> <span className="hero-wordmark-year">2027</span>
        </h1>
        <div className="hero-tagline fade-up-3">{config.eventTagline}</div>

        <p className="hero-lead fade-up-4">
          Laptops, printers, CCTV, networking, cybersecurity, AI, gaming and software from leading brands &mdash;{" "}
          {config.totalStalls} stalls across {config.categories?.length || 16} categories, four days, one roof in{" "}
          {config.eventCity}.
        </p>

        <div className="hero-ctas fade-up-5">
          <Link to="/register/exhibitor" className="btn btn-primary">
            <Icon name="store" size={18} /> Book a Stall
          </Link>
          <Link to="/register/visitor" className="btn btn-outline btn-outline-light">
            <Icon name="ticket" size={18} /> Free Visitor Pass
          </Link>
          <Link to="/directory" className="btn btn-outline btn-outline-light">
            <Icon name="users" size={18} /> Digital Directory
          </Link>
        </div>

        <div className="hero-facts fade-up-6">
          <div className="hero-fact">
            <Icon name="calendar" size={16} /> <strong>{config.eventDatesLabel}</strong>
          </div>
          <div className="hero-fact">
            <Icon name="mapPin" size={16} /> <strong>{config.venueName}</strong>
          </div>
          <div className="hero-fact">
            <Icon name="store" size={16} /> <strong>{config.totalStalls} Stalls</strong>
          </div>
        </div>

        {config.datesConfirmed && config.eventStartDateISO && <CountdownTimer targetISO={config.eventStartDateISO} />}

        <div className="hero-partner-row fade-up-6" data-testid="hero-partners">
          <div className="hero-partner">
            <span className="hero-partner-label">Organised by</span>
            <span className="hero-partner-name">VCMDWA</span>
            <span className="hero-partner-sub">Vidarbha Computer &amp; Media Dealers' Welfare Association</span>
          </div>
          <div className="hero-partner">
            <span className="hero-partner-label">Affiliated to</span>
            <span className="hero-partner-name">FAIITA · FITAM</span>
            <span className="hero-partner-sub">National &amp; state IT federations</span>
          </div>
          {mp.name && (
            <div className="hero-partner">
              <span className="hero-partner-label">Media Partner</span>
              <span className="hero-partner-name">Hayat</span>
              <span className="hero-partner-sub">{mp.name}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
