import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RoarBot from "../components/RoarBot";
import Icon from "../components/Icon";
import { useEventConfig } from "../hooks/useEventConfig";

// www.vcmdwa.org/ask — the "Ask COMP-EX Anything" assistant as a full page.
// Shareable: /ask?q=stall%20rates opens the chat and asks that question.
// The topic buttons on the side push questions into the same conversation.
const GROUPS = [
  {
    title: "Visitors",
    icon: "ticket",
    items: [
      ["Register as a visitor (free)", "register as visitor"],
      ["Is entry free?", "is entry free?"],
      ["Show my QR pass", "show my qr pass"],
      ["I didn't get my pass", "i did not get my pass"],
      ["How do I reach Nagpur?", "how to reach nagpur"],
    ],
  },
  {
    title: "Exhibitors",
    icon: "store",
    items: [
      ["Book a stall in the chat", "book a stall in chat"],
      ["Stall rates & sizes", "stall rates"],
      ["Which stall fits ₹75,000?", "which stall under 75000"],
      ["Show empty stalls", "empty stalls"],
      ["What is included in a stall?", "what is included in a stall?"],
      ["How do I pay for my stall?", "how to pay for stall"],
      ["Track my registration", "track my registration"],
    ],
  },
  {
    title: "About the expo",
    icon: "spark",
    items: [
      ["What is COMP-EX?", "about the expo"],
      ["Dates, timings & venue", "dates and venue"],
      ["Who organises COMP-EX?", "about vcmdwa"],
      ["Who is exhibiting?", "who is exhibiting"],
      ["Digital Directory", "directory"],
      ["Gaming zone & food court", "is there a gaming zone and food court?"],
    ],
  },
  {
    title: "Talk to the team",
    icon: "phone",
    items: [
      ["Request a callback", "call me back"],
      ["Send an enquiry", "send an enquiry"],
      ["Contact numbers", "contact"],
    ],
  },
];

export default function AskRoar() {
  const { config } = useEventConfig();
  const [params] = useSearchParams();
  const initial = useMemo(() => (params.get("q") || "").slice(0, 300), [params]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Ask COMP-EX Anything — COMP-EX 2027";
    return () => {
      document.title = prev;
    };
  }, []);

  const pageUrl = "https://www.vcmdwa.org/ask";
  const share = `Got a question about COMP-EX 2027 (${config.eventDatesLabel})? Ask COMP-EX Anything — register, book a stall or check your registration: ${pageUrl}`;

  function askNow(q) {
    window.dispatchEvent(new CustomEvent("compex-bot:ask", { detail: q }));
    if (window.innerWidth < 900) {
      const el = document.getElementById("ask-chat");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // clipboard blocked — the link is visible on the page anyway
    }
  }

  return (
    <section className="section ask-page">
      <div className="container">
        <header className="ask-head">
          <div className="eyebrow">Ask COMP-EX Anything</div>
          <h1>Your questions, answered instantly</h1>
          <p className="lead">
            Dates, venue, stalls, rates, registration, travel to Nagpur — ask in English, Hindi or Hinglish. You can
            also register as a visitor, book your stall and track a registration right here in the chat.
          </p>
          <div className="ask-share">
            <a className="btn btn-outline" href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noreferrer">
              <Icon name="chat" size={17} /> Share on WhatsApp
            </a>
            <button type="button" className="btn btn-outline" onClick={copyLink}>
              <Icon name={copied ? "check" : "spark"} size={17} /> {copied ? "Link copied" : "Copy link"}
            </button>
            <span className="ask-url">www.vcmdwa.org/ask</span>
          </div>
        </header>

        <div className="ask-layout">
          <div className="ask-chat" id="ask-chat">
            <RoarBot embedded initialQuestion={initial} />
          </div>

          <aside className="ask-topics" aria-label="Popular questions">
            {GROUPS.map((g) => (
              <div className="card ask-topic-card" key={g.title}>
                <div className="ask-topic-head">
                  <span className="icon-badge">
                    <Icon name={g.icon} size={18} />
                  </span>
                  <h3>{g.title}</h3>
                </div>
                <div className="ask-topic-list">
                  {g.items.map(([label, q]) => (
                    <button type="button" key={label} className="ask-topic" onClick={() => askNow(q)}>
                      {label}
                      <Icon name="arrowRight" size={14} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="ask-note">
              Answers come from the official expo information on www.vcmdwa.org. For anything else, the organising
              team replies on WhatsApp {config.contact?.whatsapp || "+91 97309 88800"} (message only).
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
