import { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about-vcmdwa", label: "About VCMDWA" },
  { to: "/#categories", label: "Categories" },
  { to: "/stalls", label: "Stalls" },
  { to: "/directory", label: "Directory" },
  { to: "/contact", label: "Contact" },
  { to: "/ask", label: "Ask COMP-EX", highlight: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            COMP<span className="brand-mark-accent">-EX</span> 2027
          </span>
          <span className="brand-sub">IT Expo · VCMDWA Nagpur</span>
        </NavLink>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => [isActive ? "active" : "", l.highlight ? "nav-ask" : ""].join(" ").trim()}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mobile-only-ctas">
            <NavLink to="/register/exhibitor" className="btn btn-primary" onClick={() => setOpen(false)}>
              Exhibit
            </NavLink>
            <NavLink to="/register/visitor" className="btn btn-outline" onClick={() => setOpen(false)}>
              Visit
            </NavLink>
            <NavLink to="/enquiry" className="btn btn-outline" onClick={() => setOpen(false)}>
              Enquiry
            </NavLink>
          </div>
        </nav>

        <div className="nav-cta">
          <NavLink to="/register/visitor" className="btn btn-outline">
            <span className="cta-long">Visitor Pass</span>
            <span className="cta-short">Visit</span>
          </NavLink>
          <NavLink to="/register/exhibitor" className="btn btn-primary">
            <span className="cta-long">Book a Stall</span>
            <span className="cta-short">Exhibit</span>
          </NavLink>
        </div>

        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
