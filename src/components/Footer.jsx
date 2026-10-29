import { Link } from "react-router-dom";
import { useEventConfig } from "../hooks/useEventConfig";
import Icon from "./Icon";

export default function Footer() {
  const { config } = useEventConfig();
  const year = new Date().getFullYear();
  const a = config.association || {};
  const mp = config.mediaPartner || {};

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="brand-mark" style={{ fontSize: 22 }}>
              COMP<span className="brand-mark-accent">-EX</span> 2027
            </span>
            <p style={{ marginTop: 12, fontSize: 14, maxWidth: 300 }}>
              Central India&rsquo;s largest IT &amp; technology exhibition, organised by the Vidarbha Computer &amp; Media
              Dealers&rsquo; Welfare Association (VCMDWA), Nagpur. Affiliated to FAIITA and FITAM.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 14 }}>
              {a.facebook && <a href={a.facebook} target="_blank" rel="noreferrer">Facebook</a>}
              {a.instagram && <a href={a.instagram} target="_blank" rel="noreferrer">Instagram</a>}
              {a.website && <a href={a.website} target="_blank" rel="noreferrer">vcmdwa.org</a>}
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/#about">About COMP-EX</Link></li>
              <li><Link to="/about-vcmdwa">About VCMDWA</Link></li>
              <li><Link to="/#categories">Categories</Link></li>
              <li><Link to="/stalls">Stall Map</Link></li>
              <li><Link to="/directory">Digital Directory</Link></li>
            </ul>
          </div>

          <div>
            <h4>Register</h4>
            <ul>
              <li><Link to="/register/exhibitor">Exhibitor Registration</Link></li>
              <li><Link to="/register/visitor">Visitor Registration</Link></li>
              <li><Link to="/ask">Ask COMP-EX Anything</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4>Get in Touch</h4>
            <ul>
              <li style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Icon name="mapPin" size={16} /> <span>{a.address || config.venueName}</span>
              </li>
              <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="phone" size={16} /> {config.contact?.phone}
              </li>
              <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="mail" size={16} /> {config.contact?.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {year} Vidarbha Computer &amp; Media Dealers&rsquo; Welfare Association. All rights reserved.
          </span>
          {mp.name && (
            <span>
              Media Partner &amp; platform: <strong>{mp.name}</strong>, {mp.city}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
