import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { api, fileUrl } from "../api";
import { useEventConfig } from "../hooks/useEventConfig";

// Digital COMP-EX Directory — every confirmed exhibitor, searchable by name,
// brand, product, category and city. The directory and its data are owned
// fully by COMP-EX / VCMDWA.
const digits = (v) => String(v || "").replace(/\D/g, "");
const waLink = (n) => {
  const d = digits(n);
  return d ? `https://wa.me/${d.length === 10 ? "91" + d : d}` : "";
};
const webLink = (w) => (!w ? "" : /^https?:\/\//i.test(w) ? w : `https://${w}`);

export default function Directory() {
  const { config } = useEventConfig();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api
      .getDirectory()
      .then((res) => setRows(res?.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!cat || r.category === cat) &&
        (!s ||
          [r.companyName, r.productsServices, r.categoryLabel, r.city, r.stallNumber, r.contactPerson]
            .join(" ")
            .toLowerCase()
            .includes(s))
    );
  }, [rows, q, cat]);

  const usedCats = useMemo(() => new Set(rows.map((r) => r.category)), [rows]);

  return (
    <>
      <section className="section page-hero-tech">
        <div className="container">
          <div className="eyebrow">Digital COMP-EX Directory</div>
          <h1 className="page-title">Find any exhibitor, brand or product</h1>
          <p className="lead">
            Every confirmed COMP-EX 2027 exhibitor with stall number, products, phone, WhatsApp and directions &mdash;
            live during the expo and online all year.
          </p>
          <div className="directory-owned">
            <Icon name="check" size={16} /> This directory is <strong>fully owned by COMP-EX / VCMDWA</strong>. Exhibitors
            are listed once their stall is confirmed by the stall committee.
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div className="directory-bar">
            <input
              className="directory-search"
              placeholder="Search company, brand, product, city or stall…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-testid="directory-search"
            />
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="directory-filter">
              <option value="">All categories</option>
              {(config.categories || []).map((c) => (
                <option key={c.key} value={c.key} disabled={rows.length > 0 && !usedCats.has(c.key)}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="directory-count">
              {loading ? "Loading…" : `${list.length} of ${rows.length} exhibitor${rows.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {!loading && rows.length === 0 && (
            <div className="card directory-empty">
              <h3>The directory fills up as stalls are confirmed</h3>
              <p>
                Exhibitors appear here automatically once the VCMDWA stall committee confirms their booking.
              </p>
              <Link to="/register/exhibitor" className="btn btn-primary">Book a stall to get listed</Link>
            </div>
          )}

          <div className="directory-grid">
            {list.map((r) => (
              <article className="card directory-card" key={r.id} data-testid="directory-card">
                <div className="directory-card-head">
                  {r.logoUrl ? (
                    <img src={fileUrl(r.logoUrl)} alt={r.companyName} className="directory-logo" loading="lazy" />
                  ) : (
                    <div className="directory-logo directory-logo-text">
                      {r.companyName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <h3 className="directory-name">{r.companyName}</h3>
                    <div className="directory-stall">
                      {r.stallNumber ? `Stall ${r.stallNumber}` : "Stall to be allotted"}
                      {r.packageLabel ? ` · ${r.packageLabel}` : ""}
                    </div>
                  </div>
                </div>
                {r.categoryLabel && <span className="chip">{r.categoryLabel}</span>}
                {r.productsServices && (
                  <p className="directory-products">
                    {open === r.id || r.productsServices.length < 140 ? r.productsServices : `${r.productsServices.slice(0, 140)}… `}
                    {r.productsServices.length >= 140 && open !== r.id && (
                      <button className="link-button" onClick={() => setOpen(r.id)}>more</button>
                    )}
                  </p>
                )}
                <div className="directory-meta">
                  {r.city && (
                    <span><Icon name="mapPin" size={14} /> {[r.city, r.state].filter(Boolean).join(", ")}</span>
                  )}
                  {r.contactPerson && <span><Icon name="users" size={14} /> {r.contactPerson}{r.designation ? `, ${r.designation}` : ""}</span>}
                </div>
                <div className="directory-actions">
                  {r.phone && <a className="btn btn-sm btn-outline" href={`tel:${digits(r.phone)}`}><Icon name="phone" size={14} /> Call</a>}
                  {r.whatsapp && <a className="btn btn-sm btn-wa" href={waLink(r.whatsapp)} target="_blank" rel="noreferrer"><Icon name="chat" size={14} /> WhatsApp</a>}
                  {r.address && (
                    <a className="btn btn-sm btn-outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`} target="_blank" rel="noreferrer">
                      <Icon name="compass" size={14} /> Directions
                    </a>
                  )}
                  {r.website && <a className="btn btn-sm btn-outline" href={webLink(r.website)} target="_blank" rel="noreferrer">Website</a>}
                  {r.stallNumber && <Link className="btn btn-sm btn-outline" to={`/stalls?stall=${encodeURIComponent(r.stallNumber)}`}><Icon name="store" size={14} /> On map</Link>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
