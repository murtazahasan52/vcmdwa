// ---------------------------------------------------------------------------
// COMP-EX 2027 — INTERACTIVE DEMO BACKEND (runs entirely in the browser).
//
// The real platform uses FastAPI + MongoDB. For the Vercel demo every call to
// /api/... is answered here instead, and the data is kept in this browser's
// localStorage — so visitors of the demo can book stalls, register, log in to
// the admin panel, approve exhibitors, scan passes and chat with the bot.
// Each browser has its own copy of the data; "Reset demo" restores the seed.
// ---------------------------------------------------------------------------
import QRCode from "qrcode";
import { fallbackConfig as CONFIG } from "../eventConfigFallback";
import LAYOUT from "./layout.json";
import KBDATA from "./kb.json";

const DB_KEY = "compex-demo-db-v1";
const HOLD_MINUTES = 15;
const ADMIN = { email: "admin@vcmdwa.org", password: "Compex@2027", name: "COMP-EX Admin" };
const MAP_URL = "/uploads/stall-maps/final-layout.png";
const BOT = KBDATA.bot;

// ------------------------------------------------------------------ helpers
const now = () => new Date().toISOString();
const oid = () => Array.from(crypto.getRandomValues(new Uint8Array(12))).map((b) => b.toString(16).padStart(2, "0")).join("");
const code = (p) => `CX-${p}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
const pkg = (c) => CONFIG.stallPackages.find((p) => p.code === c) || {};
const rupees = (n) => (n == null ? "On request" : "₹" + Number(n).toLocaleString("en-IN"));
const digits = (v) => String(v || "").replace(/\D/g, "");

class HttpError extends Error {
  constructor(status, message, extra) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

function logo(text, color) {
  const c = document.createElement("canvas");
  c.width = c.height = 240;
  const g = c.getContext("2d");
  g.fillStyle = color;
  g.fillRect(0, 0, 240, 240);
  g.fillStyle = "#fff";
  g.font = "bold 96px Poppins, Arial";
  g.textAlign = "center";
  g.fillText(text, 120, 140);
  g.font = "bold 24px Arial";
  g.fillText("DEMO", 120, 200);
  return c.toDataURL("image/png");
}

const DEMO_EXHIBITORS = [
  ["BP1", "pavilion", "Demo Infotech Systems", "laptops-desktops", "Laptops, desktops, all-in-ones and gaming notebooks — authorised partner for leading brands. Expo-only bundle offers.", "#0b5cff", "IS", "paid"],
  ["P3", "premium", "Demo Print Solutions", "printers-copiers", "Printers, copiers, ink & toner and annual maintenance contracts for SOHO and offices.", "#0e7490", "PS", "paid"],
  ["PC1", "premium-corner", "Demo SecureVision", "cctv-surveillance", "CCTV, IP cameras, NVRs, biometrics and access control. Free site survey for homes and shops.", "#b91c1c", "SV", "unpaid"],
  ["S21", "regular", "Demo NetLink Networks", "networking", "Routers, switches, Wi-Fi mesh, structured cabling and fibre for offices and campuses.", "#7c3aed", "NL", "paid"],
  ["S36", "regular", "Demo CloudSoft", "software-services", "GST billing, accounting and inventory software with cloud backup. Live demos at the stall.", "#ea580c", "CS", "unpaid"],
  ["M2", "member", "Demo Mobile World", "mobile-accessories", "Smartphones, chargers, power banks, audio and accessories at expo prices.", "#15803d", "MW", "paid"],
  ["P15", "premium", "Demo GameZone PCs", "gaming", "Custom gaming PCs, GPUs, monitors, chairs and peripherals. Try the rigs in the Gaming Zone.", "#4f46e5", "GZ", "unpaid"],
];

function exhibitorDoc(f) {
  const t = now();
  return {
    _id: oid(), registrationCode: code("STL"), itsNumber: "", contactPerson: "", designation: "", email: "", phone: "",
    landline: "", whatsapp: "", companyName: "", businessAddress: "", businessEmail: "", city: "", state: "", pincode: "",
    website: "", gstNumber: "", linkedin: "", instagram: "", facebook: "", logoUrl: "", productImages: [], category: "",
    productsServices: "", message: "", stallPackage: "", numberOfStalls: 1, stallNumber: "", stallId: null, stallRate: null,
    totalAmount: null, fasciaName: "", agreedToTerms: true, status: "pending", paymentStatus: "unpaid", emailSent: true,
    emailError: "", whatsappSent: false, whatsappError: "demo", createdAt: t, updatedAt: t, ...f,
  };
}

function seed() {
  const t = now();
  const stalls = LAYOUT.stalls.map((s) => {
    const p = pkg(s.packageCode);
    return {
      _id: oid(), stallNumber: s.stallNumber, packageCode: s.packageCode, size: `${p.label || s.packageCode} · ${s.size}`,
      rate: p.rate || 0, adminOnly: !!s.adminOnly, status: "available", heldBy: null, bookedBy: null,
      tempHoldToken: null, tempHoldExpiresAt: null, mapX: s.mapX, mapY: s.mapY, createdAt: t, updatedAt: t,
    };
  });
  const exhibitors = DEMO_EXHIBITORS.map(([stall, code_, name, cat, products, color, ini, pay], i) => {
    const st = stalls.find((s) => s.stallNumber === stall);
    const e = exhibitorDoc({
      contactPerson: `Demo Contact ${i + 1}`, designation: "Sales Manager", email: `demo${i + 1}@example.com`,
      phone: `90000000${String(i + 1).padStart(2, "0")}`, whatsapp: `90000000${String(i + 1).padStart(2, "0")}`,
      companyName: name, businessAddress: "Sitabuldi, Nagpur", businessEmail: `sales${i + 1}@example.com`, city: "Nagpur",
      state: "Maharashtra", pincode: "440012", category: cat, productsServices: products, stallPackage: code_,
      stallNumber: stall, stallId: st._id, stallRate: st.rate, fasciaName: name.toUpperCase(), logoUrl: logo(ini, color),
      itsNumber: code_ === "member" ? "VCM-DEMO-006" : "", status: "confirmed", paymentStatus: pay,
      approvedByName: ADMIN.name, approvedAt: t,
    });
    st.status = "booked";
    st.bookedBy = e._id;
    return e;
  });
  const visitors = [
    ["Demo Visitor One", "9111111101", "visitor1@example.com", "Student"],
    ["Demo Visitor Two", "9111111102", "visitor2@example.com", "IT Professional"],
  ].map(([fullName, phone, email, designation]) => ({
    _id: oid(), registrationCode: code("VIS"), fullName, email, phone, city: "Nagpur", organization: "", designation,
    interests: ["laptops-desktops"], howDidYouHear: "Social media", numberOfGuests: 1, source: "online", checkedIn: false,
    checkedInAt: null, emailSent: true, emailError: "", whatsappSent: false, whatsappError: "demo", createdAt: t, updatedAt: t,
  }));
  const enquiries = [{
    _id: oid(), name: "Demo Enquiry", email: "enquiry@example.com", mobile: "9222222201",
    details: "We would like a Brand Pavilion for our laptop brand. Please share the sponsorship deck.", status: "new",
    handledAt: null, emailSent: true, emailError: "", createdAt: t, updatedAt: t,
  }];
  const admins = [{ _id: oid(), name: ADMIN.name, email: ADMIN.email, permissions: ["all"], createdBy: null, createdAt: t, updatedAt: t, password: ADMIN.password }];
  return { stalls, exhibitors, visitors, enquiries, admins, chats: [], waLogs: [] };
}

let DB = null;
function db() {
  if (DB) return DB;
  try {
    DB = JSON.parse(localStorage.getItem(DB_KEY) || "null");
  } catch (e) {
    DB = null;
  }
  if (!DB || !Array.isArray(DB.stalls)) {
    DB = seed();
    save();
  }
  return DB;
}
function save() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
  } catch (e) {
    // storage full / private mode — keep in memory
  }
}
export function resetDemo() {
  DB = seed();
  save();
}

function releaseExpiredHolds() {
  const t = Date.now();
  db().stalls.forEach((s) => {
    if (s.tempHoldToken && s.tempHoldExpiresAt && Date.parse(s.tempHoldExpiresAt) < t && s.status === "available") {
      s.tempHoldToken = null;
      s.tempHoldExpiresAt = null;
    }
  });
}
const publicStall = (s) => {
  const holding = s.tempHoldToken && Date.parse(s.tempHoldExpiresAt) > Date.now();
  return { _id: s._id, stallNumber: s.stallNumber, packageCode: s.packageCode, size: s.size, rate: s.rate,
    adminOnly: s.adminOnly, status: holding && s.status === "available" ? "held" : s.status, mapX: s.mapX, mapY: s.mapY };
};
const findEx = (id) => {
  const e = db().exhibitors.find((x) => x._id === id);
  if (!e) throw new HttpError(404, "Exhibitor not found");
  return e;
};
const findVi = (id) => {
  const v = db().visitors.find((x) => x._id === id);
  if (!v) throw new HttpError(404, "Visitor not found");
  return v;
};
const findEn = (id) => {
  const v = db().enquiries.find((x) => x._id === id);
  if (!v) throw new HttpError(404, "Enquiry not found");
  return v;
};
function page(items, q) {
  const p = Number(q.get("page") || 1);
  const l = Number(q.get("limit") || 25);
  return { success: true, data: items.slice((p - 1) * l, p * l), total: items.length, page: p, limit: l };
}
function search(items, q, fields) {
  const s = (q.get("search") || "").trim().toLowerCase();
  const list = [...items].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return s ? list.filter((x) => fields.some((f) => String(x[f] || "").toLowerCase().includes(s))) : list;
}
function csv(rows, cols) {
  const esc = (v) => `"${String(v == null ? "" : Array.isArray(v) ? v.join("; ") : v).replace(/"/g, '""')}"`;
  return [cols.map(esc).join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
async function formToObj(body) {
  const o = {};
  if (!(body instanceof FormData)) return body || {};
  for (const [k, v] of body.entries()) {
    if (v instanceof File) {
      if (!v.size) continue;
      const data = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(v);
      });
      if (k === "productImages") (o.productImages = o.productImages || []).push(data);
      else o[k] = data;
    } else o[k] = v;
  }
  return o;
}
function bookStall(st, exId) {
  st.status = "booked";
  st.bookedBy = exId;
  st.heldBy = null;
  st.tempHoldToken = null;
  st.tempHoldExpiresAt = null;
}
function releaseStall(e) {
  const st = db().stalls.find((s) => s._id === e.stallId || s.stallNumber === e.stallNumber);
  if (st && (st.bookedBy === e._id || st.heldBy === e._id)) {
    Object.assign(st, { status: "available", bookedBy: null, heldBy: null });
  }
}

// ------------------------------------------------------------------ visitor ID card
async function idCard(v) {
  const qr = await QRCode.toDataURL(v.registrationCode, { width: 240, margin: 1 });
  const c = document.createElement("canvas");
  c.width = 1100;
  c.height = 620;
  const g = c.getContext("2d");
  g.fillStyle = "#071a3a";
  g.fillRect(0, 0, 800, 620);
  g.fillStyle = "#00b4ff";
  g.fillRect(0, 0, 24, 620);
  g.font = "bold 72px Arial";
  g.fillText("COMP-EX 2027", 80, 120);
  g.fillStyle = "#fff";
  g.font = "24px Arial";
  g.fillText("IT EXPO · VCMDWA · NAGPUR", 80, 165);
  g.fillStyle = "#00b4ff";
  g.fillRect(80, 200, 640, 2);
  g.fillStyle = "#ccc";
  g.font = "20px Arial";
  g.fillText("VISITOR INVITATION", 80, 250);
  g.fillStyle = "#fff";
  g.font = "bold 44px Arial";
  g.fillText(v.fullName, 80, 300);
  g.font = "22px Arial";
  g.fillText(`Registration ID:  ${v.registrationCode}`, 80, 400);
  g.fillText(`Guests:  ${v.numberOfGuests || 1}`, 80, 436);
  g.fillStyle = "#00b4ff";
  g.fillText(CONFIG.eventDatesLabel, 80, 500);
  g.fillStyle = "#fff";
  g.fillText(CONFIG.venueName, 80, 536);
  g.fillStyle = "#fff";
  g.fillRect(800, 0, 300, 620);
  const img = await new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.src = qr;
  });
  g.drawImage(img, 830, 180, 240, 240);
  g.fillStyle = "#071a3a";
  g.font = "bold 18px Arial";
  g.textAlign = "center";
  g.fillText("Scan at entry", 950, 450);
  g.font = "bold 20px Arial";
  g.fillText(v.registrationCode, 950, 478);
  return c.toDataURL("image/png");
}

// ------------------------------------------------------------------ chat bot (demo)
const T = (text) => ({ type: "text", text });
const L = (...items) => ({ type: "links", items });
const CARD = (title, rows, tone = "info") => ({ type: "card", title, rows, tone });
const QR = (...pairs) => pairs.map(([label, send]) => ({ label, send }));
const MENU = QR(["Book a stall", "book a stall"], ["Register as visitor", "register as visitor"], ["Empty stalls map", "empty stalls"],
  ["Stall rates", "stall rates"], ["Directory", "directory"], ["Contact", "contact"]);

function counts() {
  releaseExpiredHolds();
  return CONFIG.stallPackages.filter((p) => p.hasStallPicker).map((p) => {
    const all = db().stalls.filter((s) => s.packageCode === p.code);
    const free = all.filter((s) => publicStall(s).status === "available" && !s.adminOnly);
    return { code: p.code, label: p.label, available: free.length, total: all.length, numbers: free.map((s) => s.stallNumber) };
  });
}
function kbAnswer(low) {
  let best = null;
  let score = 0;
  for (const e of KBDATA.kb) {
    let s = 0;
    for (const k of e.keywords) if (new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(low)) s += k.split(" ").length * 2;
    if (s > score) {
      score = s;
      best = e;
    }
  }
  return score >= 2 ? best : null;
}
async function botReply(session, message) {
  const low = (message || "").toLowerCase().trim();
  const flow = session.flow;
  // --- visitor registration flow
  if (flow === "visitor") {
    const d = session.data;
    if (/^(cancel|stop|exit)$/.test(low)) {
      session.flow = null;
      return [[T("Okay, cancelled. What else can I help with?")], MENU];
    }
    if (session.step === "name") {
      if (message.trim().length < 3) return [[T("Please type your full name.")], QR(["Cancel", "cancel"])];
      d.fullName = message.trim();
      session.step = "phone";
      return [[T("Your 10-digit mobile number?")], QR(["Cancel", "cancel"])];
    }
    if (session.step === "phone") {
      const m = digits(message).slice(-10);
      if (!/^[6-9]\d{9}$/.test(m)) return [[T("That doesn't look like a mobile number. Please type the 10 digits.")], QR(["Cancel", "cancel"])];
      d.phone = m;
      session.step = "email";
      return [[T("Your e-mail address? We'll send the QR pass there.")], QR(["Cancel", "cancel"])];
    }
    if (session.step === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(message.trim())) return [[T("Please type a valid e-mail address.")], QR(["Cancel", "cancel"])];
      d.email = message.trim();
      const v = {
        _id: oid(), registrationCode: code("VIS"), fullName: d.fullName, email: d.email, phone: d.phone, city: "Nagpur",
        organization: "", designation: "", interests: [], howDidYouHear: "Ask COMP-EX Anything (website chat)", numberOfGuests: 1,
        source: "online", checkedIn: false, checkedInAt: null, emailSent: true, emailError: "", whatsappSent: false,
        whatsappError: "demo", createdAt: now(), updatedAt: now(),
      };
      db().visitors.push(v);
      save();
      session.flow = null;
      return [[T(`Done! You're registered, ${v.fullName}. Your registration ID is ${v.registrationCode}. (In the live system the pass goes by e-mail and WhatsApp.)`),
        { type: "image", url: await idCard(v), alt: `COMP-EX ID card ${v.registrationCode}`, download: `COMPEX-2027-ID-Card-${v.registrationCode}.png` }], MENU];
    }
  }
  if (/^(hi|hello|hey|namaste|menu|start)\b/.test(low) || !low) {
    return [[T(`Hello! I'm the ${BOT.name} for COMP-EX 2027, ${CONFIG.eventDatesLabel} at ${CONFIG.venueName}. Ask me anything about the expo — I can register you as a visitor right here, show empty stalls, rates and the Digital Directory. What would you like?`)], MENU];
  }
  if (/(register|sign ?up|get).*(visitor|pass|entry)|visitor registration|register me/.test(low)) {
    session.flow = "visitor";
    session.step = "name";
    session.data = {};
    return [[T("Great — let's register you as a visitor (it's free). What's your full name?")], QR(["Cancel", "cancel"])];
  }
  if (/(empty|available|free|vacant|which stalls|stall map|map|layout)/.test(low) && !/is [a-z]{1,2}\d+ free/.test(low)) {
    const c = counts();
    const free = db().stalls.filter((s) => publicStall(s).status === "available" && !s.adminOnly);
    return [[T(`${free.length} stalls are still available right now (green on the map). Tap a category below the map to see the stall numbers.`),
      { type: "map", mapUrl: MAP_URL, stalls: free.map((s) => ({ n: s.stallNumber, x: s.mapX, y: s.mapY, c: s.packageCode })), counts: c },
      L({ label: "Book a stall", to: "/register/exhibitor", primary: true }, { label: "Full-screen map", to: "/stalls" })], QR(["Stall rates", "stall rates"], ["Member stalls", "member stalls"], ["Contact", "contact"])];
  }
  const isFree = low.match(/\b(bp|pc|p|s|m)\s?(\d{1,2})\b/);
  if (isFree && /(free|available|book|status|is)/.test(low)) {
    const s = db().stalls.find((x) => x.stallNumber === (isFree[1] + isFree[2]).toUpperCase());
    if (s) {
      const st = publicStall(s).status;
      return [[CARD(`Stall ${s.stallNumber}`, [["Category", pkg(s.packageCode).label], ["Size", s.size.split("· ")[1] || ""], ["Rate", rupees(s.rate)],
        ["Status", s.adminOnly ? "Allotted by the stall committee" : st === "available" ? "Available" : st === "held" ? "Reserved (pending)" : "Booked"]], st === "available" ? "ok" : "warn"),
        L({ label: "Book it online", to: "/register/exhibitor", primary: true }, { label: "See on the map", to: "/stalls" })], MENU];
    }
  }
  if (/(rate|price|cost|charges|fees|how much|package|kitna)/.test(low)) {
    const av = Object.fromEntries(counts().map((c) => [c.code, c.available]));
    return [[T("Stall rate card (per stall, for all four days):"), {
      type: "rates", rows: CONFIG.stallPackages.map((p) => ({ code: p.code, label: p.label, rate: rupees(p.rate), count: p.stallCount || p.sizeLabel || "",
        available: p.hasStallPicker ? av[p.code] : null, note: p.inclusions })),
    }, T("VCMDWA Member Stalls are reserved for association members. Gaming Zone and Food Court spaces are priced directly with the stall committee."),
    L({ label: "Book a stall online", to: "/register/exhibitor" }, { label: "See the live stall map", to: "/stalls" })], QR(["Empty stalls map", "empty stalls"], ["Member stalls", "member stalls"], ["Contact", "contact"])];
  }
  if (/(book|exhibit|take a stall|stall booking)/.test(low)) {
    return [[T(`Exhibitor registration is online — pick your category, click the stall you want on the live map and fill the form. Stall bookings close on ${CONFIG.registrationDeadlines.stall}.`),
      L({ label: "Register as an exhibitor", to: "/register/exhibitor", primary: true }, { label: "Live stall map", to: "/stalls" })], QR(["Stall rates", "stall rates"], ["Empty stalls map", "empty stalls"])];
  }
  if (/(who is exhibiting|exhibitors|list of exhibitors|participating)/.test(low)) {
    const ex = db().exhibitors.filter((e) => e.status === "confirmed");
    return [[T(`Confirmed exhibitors (${ex.length}):`), CARD("Exhibitors", ex.map((e) => [e.stallNumber, e.companyName])),
      L({ label: "Open the Digital Directory", to: "/directory", primary: true })], MENU];
  }
  if (/(contact|phone|call|whatsapp|email|helpline)/.test(low)) {
    const c = BOT.contacts;
    return [[T("Here's how to reach the COMP-EX team at VCMDWA:"), CARD("Stalls · partnerships · sponsorship", [["Name", c.stalls.name], ["Phone", c.stalls.phone]]),
      CARD("General enquiries", [["Phone", c.enquiries.phone], ["E-mail", c.emails.join(", ")]], "muted"),
      L({ label: "Send an enquiry", to: "/enquiry" })], MENU];
  }
  if (/(date|when|timing|kab|venue|where|address)/.test(low)) {
    return [[CARD(`COMP-EX 2027 — ${CONFIG.eventEdition}`, [["Dates", CONFIG.eventDatesLabel], ["Timings", BOT.showTimings], ["Venue", CONFIG.venueName]]),
      L({ label: "Open venue in Google Maps", href: CONFIG.venueMapUrl }, { label: "About VCMDWA", to: "/about-vcmdwa" })], MENU];
  }
  const kb = kbAnswer(low);
  if (kb) return [[T(kb.answer), ...(kb.links?.length ? [L(...kb.links)] : [])], kb.chips?.length ? kb.chips.map(([label, send]) => ({ label, send })) : MENU];
  return [[T(`I didn't quite get that. I can help with visitor registration, stall booking, empty stalls, rates, dates/venue, the Digital Directory and contacts — pick one below, or call VCMDWA on ${BOT.contacts.enquiries.phone}.`)], MENU];
}

// ------------------------------------------------------------------ router
const routes = [];
const on = (method, pattern, fn) => routes.push([method, new RegExp(`^${pattern.replace(/:(\w+)/g, "(?<$1>[^/]+)")}$`), fn]);
const needAdmin = (h) => {
  if (!/demo-admin-token/.test(h.authorization || "")) throw new HttpError(401, "Please log in again");
};

// public
on("GET", "/public/config", () => ({ success: true, data: CONFIG }));
on("GET", "/public/stalls", (r) => {
  releaseExpiredHolds();
  const c = r.q.get("packageCode");
  return { success: true, data: db().stalls.filter((s) => !c || s.packageCode === c).map(publicStall) };
});
on("GET", "/public/stall-map", () => ({ success: true, data: { url: MAP_URL, uploadedAt: now(), sourceType: "image", series: LAYOUT.series } }));
on("GET", "/public/stall-directory", () => {
  releaseExpiredHolds();
  return { success: true, data: db().stalls.map((s) => {
    const p = publicStall(s);
    const owner = s.status === "booked" ? db().exhibitors.find((e) => e._id === s.bookedBy) : null;
    return { id: s._id, stallNumber: s.stallNumber, packageCode: s.packageCode, status: p.status, adminOnly: s.adminOnly, mapX: s.mapX, mapY: s.mapY,
      owner: owner ? { companyName: owner.companyName, contactPerson: owner.contactPerson } : null, rate: s.rate };
  }) };
});
const TIER = ["pavilion", "premium-corner", "premium", "member", "regular"];
on("GET", "/public/exhibitor-logos", () => ({ success: true, data: db().exhibitors.filter((e) => e.status === "confirmed" && e.logoUrl)
  .sort((a, b) => TIER.indexOf(a.stallPackage) - TIER.indexOf(b.stallPackage) || a.companyName.localeCompare(b.companyName))
  .map((e) => ({ id: e._id, companyName: e.companyName, logoUrl: e.logoUrl, packageCode: e.stallPackage, website: e.website })) }));
on("GET", "/public/directory", () => {
  const cats = Object.fromEntries(CONFIG.categories.map((c) => [c.key, c.label]));
  return { success: true, data: db().exhibitors.filter((e) => e.status === "confirmed" && !e.hideFromDirectory)
    .sort((a, b) => a.companyName.localeCompare(b.companyName)).map((r) => ({
      id: r._id, companyName: r.companyName, logoUrl: r.logoUrl, stallNumber: r.stallNumber, packageCode: r.stallPackage,
      packageLabel: pkg(r.stallPackage).label || "", category: r.category, categoryLabel: cats[r.category] || r.category,
      productsServices: r.productsServices, city: r.city, state: r.state, address: r.businessAddress, phone: r.phone,
      whatsapp: r.whatsapp || r.phone, landline: r.landline, email: r.businessEmail, website: r.website, instagram: r.instagram,
      facebook: r.facebook, linkedin: r.linkedin, contactPerson: r.contactPerson, designation: r.designation })) };
});
on("GET", "/public/event.ics", () => ({ __raw: true, type: "text/calendar", body: [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VCMDWA//COMP-EX//EN", "BEGIN:VEVENT", "UID:compex-2027@vcmdwa.org",
  `DTSTART;VALUE=DATE:${CONFIG.eventStartDateISO.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${CONFIG.eventEndDateISO.replace(/-/g, "")}`,
  "SUMMARY:COMP-EX 2027", `LOCATION:${CONFIG.venueAddress}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n") }));
on("POST", "/public/stalls/:n/hold", (r) => {
  releaseExpiredHolds();
  const n = decodeURIComponent(r.p.n).toUpperCase();
  const prev = r.body?.previousToken;
  if (prev) db().stalls.forEach((s) => { if (s.tempHoldToken === prev) Object.assign(s, { tempHoldToken: null, tempHoldExpiresAt: null }); });
  const s = db().stalls.find((x) => x.stallNumber === n);
  if (!s || s.status !== "available" || s.adminOnly || (s.tempHoldToken && Date.parse(s.tempHoldExpiresAt) > Date.now()))
    throw new HttpError(409, "That stall has just been taken by someone else. Please pick another available stall.");
  s.tempHoldToken = oid();
  s.tempHoldExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60000).toISOString();
  save();
  return { success: true, message: `${n} is reserved for you for ${HOLD_MINUTES} minutes while you complete the form.`,
    data: { stall: { _id: s._id, stallNumber: s.stallNumber, packageCode: s.packageCode, rate: s.rate, status: "held" },
      holdToken: s.tempHoldToken, expiresAt: s.tempHoldExpiresAt, holdMinutes: HOLD_MINUTES } };
});
on("POST", "/public/stalls/release-hold", (r) => {
  let released = false;
  db().stalls.forEach((s) => {
    if (r.body?.holdToken && s.tempHoldToken === r.body.holdToken) {
      Object.assign(s, { tempHoldToken: null, tempHoldExpiresAt: null });
      released = true;
    }
  });
  save();
  return { success: true, data: { released } };
});
on("POST", "/exhibitors/register", async (r) => {
  const f = await formToObj(r.body);
  const errors = [];
  if (!f.contactPerson?.trim()) errors.push(["contactPerson", "Name is required"]);
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email || "")) errors.push(["email", "A valid personal email is required"]);
  if (!/^[6-9]\d{9}$/.test(digits(f.phone).slice(-10))) errors.push(["phone", "A valid 10-digit mobile number is required"]);
  if (!f.companyName?.trim()) errors.push(["companyName", "Business/company name is required"]);
  if (!f.businessAddress?.trim()) errors.push(["businessAddress", "Business address is required"]);
  if (!f.category) errors.push(["category", "Category is required"]);
  if (!f.stallPackage) errors.push(["stallPackage", "Stall package is required"]);
  if (!f.fasciaName?.trim()) errors.push(["fasciaName", "Fascia name for your stall is required"]);
  if (f.stallPackage === "member" && (f.itsNumber || "").trim().length < 2) errors.push(["itsNumber", "VCMDWA membership number is required for Member Stalls"]);
  if (errors.length) throw new HttpError(400, errors.map((e) => e[1]).join(". "), { errors: Object.fromEntries(errors) });
  const p = pkg(f.stallPackage);
  let st = null;
  if (p.hasStallPicker) {
    st = db().stalls.find((s) => s.stallNumber === (f.stallNumber || "").toUpperCase());
    if (!st) throw new HttpError(400, "Please select a stall from the venue map before submitting.", { errors: { stallNumber: "Stall selection is required." } });
    const heldByOther = st.tempHoldToken && st.tempHoldToken !== f.holdToken && Date.parse(st.tempHoldExpiresAt) > Date.now();
    if (st.status !== "available" || heldByOther) throw new HttpError(409, `Stall ${st.stallNumber} is no longer available. Please pick another stall.`);
  }
  const e = exhibitorDoc({ ...f, numberOfStalls: 1, stallNumber: st?.stallNumber || "", stallId: st?._id || null, stallRate: st?.rate ?? p.rate ?? null,
    logoUrl: f.logo || "", productImages: f.productImages || [] });
  delete e.logo;
  delete e.holdToken;
  delete e.agreedToTerms;
  e.agreedToTerms = true;
  if (st) Object.assign(st, { status: "held", heldBy: e._id, tempHoldToken: null, tempHoldExpiresAt: null });
  db().exhibitors.push(e);
  save();
  return { success: true, message: "Registration received. A confirmation email has been sent — your stall is reserved pending organizer approval.", data: { registrationCode: e.registrationCode } };
});
on("POST", "/visitors/register", (r) => {
  const b = r.body || {};
  if (!b.fullName?.trim() || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(b.email || "") || !/^[6-9]\d{9}$/.test(digits(b.phone).slice(-10)))
    throw new HttpError(400, "Validation failed — please check name, e-mail and phone.");
  const v = { _id: oid(), registrationCode: code("VIS"), fullName: b.fullName.trim(), email: b.email.trim(), phone: digits(b.phone).slice(-10),
    city: b.city || "", organization: b.organization || "", designation: b.designation || "", interests: b.interests || [],
    howDidYouHear: b.howDidYouHear || "", numberOfGuests: Number(b.numberOfGuests || 1), source: b.source || "online",
    checkedIn: b.source === "onsite", checkedInAt: b.source === "onsite" ? now() : null, emailSent: true, emailError: "",
    whatsappSent: false, whatsappError: "demo", createdAt: now(), updatedAt: now() };
  db().visitors.push(v);
  save();
  return { success: true, message: "Registration successful. Your ID card with a QR code has been emailed to you.", data: { registrationCode: v.registrationCode } };
});
on("POST", "/enquiries", (r) => {
  const b = r.body || {};
  const e = { _id: oid(), name: b.name, email: b.email, mobile: b.mobile, details: b.details, status: "new", handledAt: null, emailSent: true, emailError: "", createdAt: now(), updatedAt: now() };
  db().enquiries.push(e);
  save();
  return { success: true, message: "Thanks — your enquiry has been sent. Our team will get back to you shortly.", data: { id: e._id } };
});
on("GET", "/bot/info", () => ({ success: true, data: { name: BOT.name, title: BOT.title, ai: false } }));
on("POST", "/bot/chat", async (r) => {
  const b = r.body || {};
  const sid = b.sessionId || oid();
  let chat = db().chats.find((c) => c.sessionId === sid);
  if (!chat) {
    chat = { _id: oid(), sessionId: sid, messages: [], tags: [], createdAt: now(), updatedAt: now(), state: {} };
    db().chats.push(chat);
  }
  if (b.message) chat.messages.push({ r: "u", t: b.message, at: now() });
  const [messages, quickReplies] = await botReply(chat.state, b.message || "");
  chat.messages.push({ r: "b", t: messages.filter((m) => m.type === "text").map((m) => m.text).join(" ").slice(0, 400), at: now() });
  if (chat.state.flow === null && /You're registered/.test(chat.messages.at(-1).t)) chat.tags.push("registered");
  chat.updatedAt = now();
  chat.lastMessage = b.message || "(opened chat)";
  chat.count = chat.messages.length;
  save();
  return { success: true, data: { messages, quickReplies, flow: chat.state.flow || null, step: chat.state.step || null, ai: false, sessionId: sid } };
});

// admin
on("POST", "/admin/login", (r) => {
  const a = db().admins.find((x) => x.email === String(r.body?.email || "").toLowerCase().trim() && x.password === r.body?.password);
  if (!a) throw new HttpError(401, `Invalid credentials — demo login is ${ADMIN.email} / ${ADMIN.password}`);
  return { success: true, token: `demo-admin-token.${a._id}`, admin: { name: a.name, email: a.email, permissions: a.permissions } };
});
on("GET", "/admin/stats", (r) => {
  needAdmin(r.h);
  const d = db();
  return { success: true, data: { exhibitorCount: d.exhibitors.length, approvedExhibitorCount: d.exhibitors.filter((e) => e.status === "confirmed").length,
    pendingExhibitorCount: d.exhibitors.filter((e) => e.status === "pending").length, visitorCount: d.visitors.length,
    checkedInCount: d.visitors.filter((v) => v.checkedIn).length, newEnquiryCount: d.enquiries.filter((e) => e.status === "new").length } };
});
const EX_FIELDS = ["companyName", "contactPerson", "email", "phone", "registrationCode"];
const EX_COLS = ["registrationCode", "itsNumber", "companyName", "contactPerson", "designation", "email", "phone", "whatsapp", "businessAddress", "city", "state",
  "pincode", "website", "category", "stallPackage", "stallNumber", "stallRate", "fasciaName", "gstNumber", "status", "paymentStatus", "createdAt"];
on("GET", "/admin/exhibitors", (r) => { needAdmin(r.h); return page(search(db().exhibitors, r.q, EX_FIELDS), r.q); });
on("GET", "/admin/exhibitors/export", (r) => ({ __raw: true, type: "text/csv", body: csv(search(db().exhibitors, r.q, EX_FIELDS), EX_COLS) }));
on("GET", "/admin/exhibitors/:id/invoice", (r) => {
  const e = findEx(r.p.id);
  const amt = e.totalAmount || e.stallRate || 0;
  return { __raw: true, type: "text/html", body: `<!doctype html><html><head><title>Invoice ${e.registrationCode}</title><style>body{font-family:Arial;max-width:720px;margin:40px auto;color:#0b1a35}
  .h{background:#071a3a;color:#fff;padding:24px;border-radius:10px}.h b{font-size:30px;color:#00b4ff}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{border-bottom:1px solid #dde;padding:10px;text-align:left}</style></head>
  <body><div class="h"><b>COMP-EX 2027</b><div>Organised by VCMDWA, Nagpur · Booking Summary (demo)</div></div>
  <p><strong>${e.companyName}</strong><br>${e.contactPerson} · ${e.phone}<br>${e.businessAddress}</p><p>Registration ID: <b>${e.registrationCode}</b></p>
  <table><tr><th>Description</th><th>Amount</th></tr><tr><td>${pkg(e.stallPackage).label || e.stallPackage} — Stall ${e.stallNumber}</td><td>${rupees(amt)}</td></tr>
  <tr><th>Total</th><th>${rupees(amt)}</th></tr></table><p>Payment status: <b>${e.paymentStatus || "unpaid"}</b></p>
  <p style="color:#888;font-size:12px">Demo document — the live system generates a PDF invoice with VCMDWA's bank details.</p></body></html>` };
});
on("GET", "/admin/exhibitors/:id", (r) => { needAdmin(r.h); return { success: true, data: findEx(r.p.id) }; });
on("PATCH", "/admin/exhibitors/:id", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  const b = r.body || {};
  if (b.stallNumber && b.stallNumber !== e.stallNumber) {
    const st = db().stalls.find((s) => s.stallNumber === String(b.stallNumber).toUpperCase());
    if (!st || st.status !== "available") throw new HttpError(409, "That stall is not available");
    releaseStall(e);
    if (e.status === "confirmed") bookStall(st, e._id);
    else Object.assign(st, { status: "held", heldBy: e._id });
    e.stallNumber = st.stallNumber;
    e.stallId = st._id;
    e.stallPackage = st.packageCode;
    e.stallRate = st.rate;
  }
  Object.entries(b).forEach(([k, v]) => { if (!["stallNumber", "_id", "status"].includes(k)) e[k] = v; });
  e.updatedAt = now();
  save();
  return { success: true, message: "Exhibitor updated", data: e };
});
on("DELETE", "/admin/exhibitors/:id", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  releaseStall(e);
  db().exhibitors = db().exhibitors.filter((x) => x !== e);
  save();
  return { success: true, message: "Exhibitor registration deleted and its stall released" };
});
on("POST", "/admin/exhibitors/:id/approve", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  if (e.status === "confirmed") return { success: true, message: "Already confirmed", data: e };
  const st = db().stalls.find((s) => s._id === e.stallId);
  if (st) bookStall(st, e._id);
  Object.assign(e, { status: "confirmed", paymentStatus: r.body?.paymentStatus === "paid" ? "paid" : "unpaid", approvedByName: ADMIN.name, approvedAt: now(), updatedAt: now() });
  save();
  return { success: true, message: "Exhibitor approved (demo: confirmation e-mail + WhatsApp would be sent)", data: e };
});
on("POST", "/admin/exhibitors/:id/reject", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  releaseStall(e);
  Object.assign(e, { status: "cancelled", updatedAt: now() });
  save();
  return { success: true, message: "Exhibitor rejected, stall released and the exhibitor notified", data: e };
});
on("POST", "/admin/exhibitors/:id/reopen", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  const st = db().stalls.find((s) => s._id === e.stallId);
  if (st && st.status === "available") Object.assign(st, { status: "held", heldBy: e._id });
  Object.assign(e, { status: "pending", updatedAt: now() });
  save();
  return { success: true, message: "Registration reopened", data: e };
});
on("PATCH", "/admin/exhibitors/:id/payment", (r) => {
  needAdmin(r.h);
  const e = findEx(r.p.id);
  e.paymentStatus = r.body?.paymentStatus === "paid" ? "paid" : "unpaid";
  save();
  return { success: true, message: `Marked ${e.paymentStatus}`, data: e };
});
on("POST", "/admin/exhibitors/:id/payment-reminder", (r) => ({ success: true, message: `Payment reminder sent to ${findEx(r.p.id).email} (demo)` }));
on("POST", "/admin/exhibitors/:id/logo", async (r) => {
  const e = findEx(r.p.id);
  const f = await formToObj(r.body);
  if (f.logo) e.logoUrl = f.logo;
  save();
  return { success: true, message: "Logo uploaded", data: e };
});
on("POST", "/admin/exhibitors/book", async (r) => {
  needAdmin(r.h);
  const f = await formToObj(r.body);
  const nums = (f.stallNumbers || f.stallNumber || "").split(",").map((x) => x.trim().toUpperCase()).filter(Boolean);
  const sts = nums.map((n) => db().stalls.find((s) => s.stallNumber === n));
  if (!sts.length || sts.some((s) => !s || s.status !== "available")) throw new HttpError(409, "One of the selected stalls is not available");
  const total = f.amount ? Number(digits(f.amount)) : sts.reduce((a, s) => a + (s.rate || 0), 0);
  const e = exhibitorDoc({ ...f, stallNumber: nums.join(", "), stallId: sts[0]._id, stallPackage: sts[0].packageCode, numberOfStalls: sts.length,
    stallRate: Math.round(total / sts.length), totalAmount: total, status: "confirmed", approvedByName: ADMIN.name, approvedAt: now(), logoUrl: f.logo || "" });
  delete e.logo;
  sts.forEach((s) => bookStall(s, e._id));
  db().exhibitors.push(e);
  save();
  return { success: true, message: `${nums.join(", ")} booked for ${e.companyName}.`, data: e };
});
const VI_FIELDS = ["fullName", "email", "phone", "registrationCode", "organization"];
on("GET", "/admin/visitors", (r) => { needAdmin(r.h); return page(search(db().visitors, r.q, VI_FIELDS), r.q); });
on("GET", "/admin/visitors/export", (r) => ({ __raw: true, type: "text/csv", body: csv(search(db().visitors, r.q, VI_FIELDS),
  ["registrationCode", "fullName", "email", "phone", "city", "organization", "designation", "numberOfGuests", "source", "checkedIn", "checkedInAt", "createdAt"]) }));
on("GET", "/admin/visitors/entrance-qr", async () => {
  const url = `${location.origin}/register/visitor?source=onsite`;
  return { success: true, data: { url, qrDataUrl: await QRCode.toDataURL(url, { width: 400, margin: 1 }) } };
});
on("GET", "/admin/visitors/:id", (r) => { needAdmin(r.h); return { success: true, data: findVi(r.p.id) }; });
on("PATCH", "/admin/visitors/:id", (r) => {
  needAdmin(r.h);
  const v = findVi(r.p.id);
  Object.assign(v, r.body || {}, { updatedAt: now() });
  save();
  return { success: true, message: "Visitor updated", data: v };
});
on("DELETE", "/admin/visitors/:id", (r) => {
  needAdmin(r.h);
  db().visitors = db().visitors.filter((v) => v._id !== r.p.id);
  save();
  return { success: true, message: "Visitor registration deleted" };
});
on("POST", "/admin/visitors/:id/resend-pass", (r) => ({ success: true, message: `Pass re-sent to ${findVi(r.p.id).email} (demo)`, data: findVi(r.p.id) }));
on("POST", "/admin/check-in", (r) => {
  needAdmin(r.h);
  const c = String(r.body?.registrationCode || "").trim().toUpperCase();
  if (!c) throw new HttpError(400, "registrationCode is required");
  const v = db().visitors.find((x) => x.registrationCode === c);
  if (!v) throw new HttpError(404, "Registration code not found");
  if (v.checkedIn) return { success: true, message: "Already checked in", data: v, alreadyCheckedIn: true };
  Object.assign(v, { checkedIn: true, checkedInAt: now() });
  save();
  return { success: true, message: "Checked in successfully", data: v };
});
const EN_FIELDS = ["name", "email", "mobile", "details"];
on("GET", "/admin/enquiries", (r) => {
  needAdmin(r.h);
  const st = r.q.get("status");
  const list = search(db().enquiries, r.q, EN_FIELDS).filter((e) => !st || e.status === st);
  return { ...page(list, r.q), newCount: db().enquiries.filter((e) => e.status === "new").length };
});
on("GET", "/admin/enquiries/export", (r) => ({ __raw: true, type: "text/csv", body: csv(search(db().enquiries, r.q, EN_FIELDS), ["name", "email", "mobile", "details", "status", "createdAt"]) }));
on("GET", "/admin/enquiries/:id", (r) => ({ success: true, data: findEn(r.p.id) }));
on("PATCH", "/admin/enquiries/:id", (r) => {
  const e = findEn(r.p.id);
  Object.assign(e, r.body || {}, { updatedAt: now() });
  if (r.body?.status === "handled") e.handledAt = now();
  save();
  return { success: true, message: "Enquiry updated", data: e };
});
on("DELETE", "/admin/enquiries/:id", (r) => {
  db().enquiries = db().enquiries.filter((e) => e._id !== r.p.id);
  save();
  return { success: true, message: "Enquiry deleted" };
});
on("GET", "/admin/stalls", (r) => { needAdmin(r.h); releaseExpiredHolds(); return { success: true, data: db().stalls }; });
on("PATCH", "/admin/stalls/:id", (r) => {
  const s = db().stalls.find((x) => x._id === r.p.id);
  if (!s) throw new HttpError(404, "Stall not found");
  Object.assign(s, r.body || {}, { updatedAt: now() });
  save();
  return { success: true, data: s };
});
on("DELETE", "/admin/stalls/:id", (r) => {
  const s = db().stalls.find((x) => x._id === r.p.id);
  if (s?.status === "booked") throw new HttpError(409, "Cannot delete a booked stall — change its status first");
  db().stalls = db().stalls.filter((x) => x._id !== r.p.id);
  save();
  return { success: true, message: "Stall removed" };
});
on("GET", "/admin/stalls/detection", () => ({ success: true, data: { url: MAP_URL, uploadedAt: now(), sourceType: "image", series: LAYOUT.series, detection: { status: "none" } } }));
on("POST", "/admin/stalls/apply-bundled-layout", () => ({ success: true, message: "The COMP-EX layout (102 stalls) is already live in this demo.", data: { total: 102, created: [], updated: [], removed: [] } }));
const NOT_IN_DEMO = () => { throw new HttpError(400, "Uploading and auto-detecting a new venue drawing works in the full system (server needed) — not in this browser demo."); };
["/admin/stalls/upload-map", "/admin/stalls/detect-layout", "/admin/stalls/apply-layout", "/admin/stalls/generate-from-series", "/admin/stalls"].forEach((p) => on("POST", p, NOT_IN_DEMO));
on("PUT", "/admin/stalls/map-series", NOT_IN_DEMO);
on("GET", "/admin/admins", () => ({ success: true, data: db().admins.map(({ password, ...a }) => a) }));
on("POST", "/admin/admins", (r) => {
  const b = r.body || {};
  if (!b.email || !b.password) throw new HttpError(400, "Name, e-mail and password are required");
  const a = { _id: oid(), name: b.name || b.email, email: b.email.toLowerCase(), password: b.password, permissions: b.permissions || ["exhibitors"], createdBy: ADMIN.name, createdAt: now(), updatedAt: now() };
  db().admins.push(a);
  save();
  const { password, ...out } = a;
  return { success: true, message: "Admin created", data: out };
});
on("DELETE", "/admin/admins/:id", (r) => {
  db().admins = db().admins.filter((a) => a._id !== r.p.id || a.email === ADMIN.email);
  save();
  return { success: true, message: "Admin removed" };
});
on("POST", "/admin/me/password", () => ({ success: true, message: "Password change is disabled in the demo." }));
on("POST", "/admin/admins/:id/password", () => ({ success: true, message: "Password reset (demo)." }));
on("GET", "/admin/bot/stats", () => {
  const c = db().chats;
  const day = Date.now() - 864e5;
  return { success: true, data: { total: c.length, today: c.filter((x) => Date.parse(x.createdAt) > day).length, registered: c.filter((x) => x.tags.includes("registered")).length,
    callbacks: 0, unanswered: 0, ratings: 0, avgRating: null, stallBooked: 0, enquiries: 0 } };
});
on("GET", "/admin/bot/chats", (r) => page([...db().chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), r.q));
on("GET", "/admin/bot/chats/:sid", (r) => {
  const c = db().chats.find((x) => x.sessionId === decodeURIComponent(r.p.sid));
  if (!c) throw new HttpError(404, "Chat not found");
  return { success: true, data: c };
});
on("DELETE", "/admin/bot/chats/:sid", (r) => {
  db().chats = db().chats.filter((x) => x.sessionId !== decodeURIComponent(r.p.sid));
  save();
  return { success: true, message: "Chat deleted" };
});
on("GET", "/admin/whatsapp/config", () => ({ success: true, data: { provider: "", enabled: false, note: "WhatsApp is connected in the live system only." } }));
on("PUT", "/admin/whatsapp/config", () => ({ success: true, message: "WhatsApp settings are not saved in the demo.", data: { provider: "", enabled: false } }));
on("GET", "/admin/whatsapp/templates", () => ({ success: true, data: [] }));
on("PUT", "/admin/whatsapp/templates/:k", () => ({ success: true, message: "Not saved in the demo.", data: {} }));
on("GET", "/admin/whatsapp/logs", () => ({ success: true, data: [], total: 0 }));
on("POST", "/admin/whatsapp/test", () => ({ success: true, message: "Demo: no WhatsApp message was actually sent." }));
on("POST", "/admin/whatsapp/broadcast", () => ({ success: true, message: "Demo: broadcast simulated — no messages sent.", data: { sent: 0, failed: 0, total: 0 } }));

// ------------------------------------------------------------------ fetch interceptor
function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
export function installDemoServer(apiBase) {
  const realFetch = window.fetch.bind(window);
  const base = new URL(apiBase, location.origin);
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url, location.origin);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || url.pathname.startsWith(`${base.pathname}/uploads/`)) {
      return realFetch(input, init);
    }
    const path = url.pathname.slice(base.pathname.length).replace(/\/$/, "") || "/";
    const method = (init.method || "GET").toUpperCase();
    const headers = {};
    new Headers(init.headers || {}).forEach((v, k) => { headers[k.toLowerCase()] = v; });
    let body = init.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep string
      }
    }
    await new Promise((r) => setTimeout(r, 120)); // feel like a network call
    for (const [m, re, fn] of routes) {
      const hit = m === method && path.match(re);
      if (!hit) continue;
      try {
        const out = await fn({ p: hit.groups || {}, q: url.searchParams, body, h: headers });
        if (out && out.__raw) return new Response(out.body, { status: 200, headers: { "Content-Type": out.type } });
        return json(200, out);
      } catch (err) {
        if (err instanceof HttpError) return json(err.status, { success: false, message: err.message, ...(err.extra || {}) });
        console.error("[demo api]", err);
        return json(500, { success: false, message: `Demo server error: ${err.message}` });
      }
    }
    return json(404, { success: false, message: `Demo: ${method} ${path} is not available in the browser demo.` });
  };
}
