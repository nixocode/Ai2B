"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Stage from "@/components/Stage";

const ACTS = 7;
const EXPERIENCE_VH = 700;

const ArrowOut = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

type AgentKey = "sales" | "support" | "ops" | "research";

const AGENTS: Record<AgentKey, { color: string; tag: string; node: string }> = {
  sales:    { color: "#FF5A1F", tag: "NODE_01 · SALES_AGENT",    node: "01" },
  support:  { color: "#E85D75", tag: "NODE_02 · SUPPORT_AGENT",  node: "02" },
  ops:      { color: "#FFB84D", tag: "NODE_03 · OPS_AGENT",      node: "03" },
  research: { color: "#6EA8FE", tag: "NODE_04 · RESEARCH_AGENT", node: "04" },
};

export default function Home() {
  const [act, setAct] = useState(0);
  const [pct, setPct] = useState(0);
  const pctRef = useRef<HTMLSpanElement>(null);

  const handleProgress = useCallback((p: number, a: number) => {
    if (pctRef.current) pctRef.current.textContent = (p * 100).toFixed(2) + "%";
    setPct(p);
    setAct((prev) => (prev !== a ? a : prev));
  }, []);

  // jump to act on rail click
  const jumpToAct = (i: number) => {
    const max = (EXPERIENCE_VH / 100) * window.innerHeight;
    window.scrollTo({ top: (i / (ACTS - 1)) * max, behavior: "smooth" });
  };

  // animate telemetry bars when their panel becomes active
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".telem.panel").forEach((t) => {
      const isOn = t.classList.contains("on");
      t.querySelectorAll<HTMLElement>(".bar i").forEach((bar) => {
        const w = bar.dataset.w ?? "50%";
        bar.style.width = isOn ? w : "0%";
      });
    });
  }, [act]);

  return (
    <>
      {/* WebGL backdrop */}
      <Stage experienceVh={EXPERIENCE_VH} onProgress={handleProgress} />

      {/* SYSBAR */}
      <div className="sysbar" role="status" aria-label="System status">
        <span className="live">SYS · AI2B / SCROLL_EXPERIENCE</span>
        <span className="sep">│</span>
        <span>BCN · UTC+01</span>
        <span className="sep">│</span>
        <span>RENDERER WEBGL2 · 60FPS</span>
        <span className="scroll-pct" ref={pctRef}>0.00%</span>
      </div>

      {/* corner marks */}
      <div className="marks" aria-hidden>
        <span className="tl" /><span className="tr" /><span className="bl" /><span className="br" />
      </div>

      {/* RIGHT RAIL */}
      <nav className="rail" aria-label="Section index">
        {[
          "§00 · INDEX",
          "§01 · SWARM",
          "§02 · SALES",
          "§03 · SUPPORT",
          "§04 · OPS",
          "§05 · RESEARCH",
          "§06 · DEPLOY",
        ].map((label, i) => (
          <button
            key={label}
            className={`tick${i === act ? " active" : ""}`}
            onClick={() => jumpToAct(i)}
          >
            <span>{label}</span>
            <span className="bar" />
          </button>
        ))}
      </nav>

      {/* HUD — fixed, content swaps by act */}
      <div className="hud" aria-live="polite">
        {/* §00 INDEX */}
        <div className={`panel p0${act === 0 ? " on" : ""}`}>
          <div className="eyebrow">
            <span className="ln" />
            <span>§00 / INDEX · 2026.04</span>
          </div>
          <h1 className="h-display">
            Custom AI<br />
            <span className="muted">agents,</span> <span className="accent">forged</span><br />
            to your stack.
          </h1>
          <div className="legend">
            <div className="mono-row k">SCROLL TO BEGIN</div>
            <div className="mono-row" style={{ color: "var(--subtle)", marginTop: 6 }}>
              06 ACTS · ~30 SEC
            </div>
          </div>
        </div>

        {/* §01 SWARM */}
        <div className={`panel p1${act === 1 ? " on" : ""}`}>
          <div className="eyebrow">§01 / THE SWARM</div>
          <h2 className="h-display">Unlimited agents.<br />One brain.</h2>
          <p className="copy">
            Each node is a purpose-built agent. Run one — or a hundred. Local LLMs,
            your servers, your data. Hardware is the only ceiling.
          </p>
        </div>
        <div className={`agent-readout panel${act === 1 ? " on" : ""}`}>
          <div className="row"><span className="k">Active nodes</span><span className="v"><span className="pulse">●</span> 142 / ∞</span></div>
          <div className="row"><span className="k">Topology</span><span className="v">mesh · async</span></div>
          <div className="row"><span className="k">Inference</span><span className="v">on-prem · GPU</span></div>
          <div className="row"><span className="k">Egress</span><span className="v">0 bytes</span></div>
          <div className="row"><span className="k">Uptime</span><span className="v">99.98%</span></div>
          <div className="row"><span className="k">Latency</span><span className="v">42ms p95</span></div>
        </div>

        {/* §02 SALES */}
        <AgentPanel
          on={act === 2}
          agent="sales"
          title={<>Reads the<br />pipeline.<br />Writes the<br />follow-ups.</>}
          lede="Qualifies inbound in under a second. Drafts in your voice. Updates the CRM without a human lifting a finger."
          bullets={["1,200 leads / month — silently", "2-way HubSpot · Salesforce sync", "Booked the demo before you woke up"]}
        />
        <Telemetry
          on={act === 2}
          agent="sales"
          status="ONLINE"
          rows={[
            ["Leads / min",  "78%", "14.2"],
            ["Conv. rate",   "62%", "31.4%"],
            ["Reply time",   "92%", "0.4s"],
            ["Pipeline",     "54%", "€2.1M"],
          ]}
        />

        {/* §03 SUPPORT */}
        <AgentPanel
          on={act === 3}
          agent="support"
          title={<>Triages,<br />resolves,<br />escalates —<br />24/7.</>}
          lede="Classifies tickets by intent and urgency. Answers from your docs with citations. Escalates the 3% that need a human."
          bullets={["142 tickets / day · 97% closed", "Cites source page · paragraph", "Trained on your last 5 years"]}
        />
        <Telemetry
          on={act === 3}
          agent="support"
          status="ONLINE"
          rows={[
            ["Tickets / day", "84%", "142"],
            ["Resolved",      "97%", "97%"],
            ["CSAT",          "88%", "4.6 / 5"],
            ["Escalations",   "18%", "3%"],
          ]}
        />

        {/* §04 OPS */}
        <AgentPanel
          on={act === 4}
          agent="ops"
          title={<>Schedules,<br />stocks,<br />rebalances<br />overnight.</>}
          lede="Re-balances the rota when a shift drops. Reorders from demand signals. Flags anomalies before they become fires."
          bullets={["Runs at 03:00 · cron · on-prem", "POS + sensors + rota + inventory", "No cloud · no leaks · no drift"]}
        />
        <Telemetry
          on={act === 4}
          agent="ops"
          status="ONLINE"
          rows={[
            ["Rota gaps",  "8%",  "0 / 24"],
            ["Reorders",   "46%", "7 today"],
            ["Anomalies",  "22%", "2 flagged"],
            ["Cycle time", "72%", "3m 14s"],
          ]}
        />

        {/* §05 RESEARCH */}
        <AgentPanel
          on={act === 5}
          agent="research"
          title={<>Reads<br />everything<br />you don&apos;t have<br />time for.</>}
          lede="Digests contracts, papers, and reports. Extracts what matters, cites the source. Turns 40 pages into 5 lines."
          bullets={["47 docs · 182 citations / day", "PDFs · email · web · drive", "One agent · one GPU · one coffee"]}
        />
        <Telemetry
          on={act === 5}
          agent="research"
          status="SCANNING"
          rows={[
            ["Docs / day",     "64%", "47"],
            ["Citations",      "82%", "182"],
            ["Compression",    "91%", "8:1"],
            ["Hallucination",  "4%",  "< 0.4%"],
          ]}
        />

        {/* §06 DEPLOY */}
        <div className={`panel p6${act === 6 ? " on" : ""}`}>
          <div className="eyebrow">§06 / DEPLOY</div>
          <h2 className="h-display">2 weeks to prototype.<br /><em>4–6 to production.</em></h2>
          <p className="copy">
            Working software on your stack. Full code handover. No vendor lock-in. Ever.
          </p>
          <div className="ctas">
            <a className="btn primary" href="#contact">Book a call <ArrowOut /></a>
            <a className="btn ghost" href="#contact">hello@ai2b.io</a>
          </div>
        </div>
      </div>

      <div className={`scroll-hint${act === 0 ? " show" : ""}`}>
        <span>Scroll</span>
        <span className="ln" />
      </div>

      {/* invisible scroll spacer that drives the experience */}
      <div className="scroller" aria-hidden>
        {Array.from({ length: ACTS }).map((_, i) => (
          <div key={i} className="act" />
        ))}
      </div>

      {/* INFORMATIVE CONTENT — appears below the experience */}
      <div className="info">
        <div className="info-inner">
          {/* §M Method */}
          <section id="method">
            <div className="sect-head">
              <div className="sect-id">
                <span className="glyph">§</span><span className="n">M</span><span className="glyph">/</span><span>Method</span>
              </div>
              <div className="sect-rule" />
              <div className="sect-meta">4–6 wks end-to-end</div>
            </div>
            <div className="sect-intro">
              <h2>Three steps. <span className="muted">Zero fluff.</span></h2>
              <p>
                One transparent process. Clear deliverables at every stage. You always know what&apos;s shipping next, and why.
              </p>
            </div>
            <div className="method">
              <article className="mstep">
                <div className="mstep-n"><span>01 · Diagnose</span><span className="wk">wk 1</span></div>
                <div>
                  <div className="mstep-ttl">Map the workflow.</div>
                  <div className="mstep-desc">
                    Two days on-site. We shadow the team, tag bottlenecks, pull data samples. Then a short memo — what we&apos;d build, and what we&apos;d leave alone.
                  </div>
                </div>
                <div className="mstep-deliv">
                  <div className="k">Deliverables</div>
                  <ul>
                    <li>Workflow audit</li>
                    <li>Opportunity memo (6p)</li>
                    <li>Scope &amp; budget</li>
                  </ul>
                </div>
              </article>
              <article className="mstep">
                <div className="mstep-n"><span>02 · Build</span><span className="wk">wk 2–5</span></div>
                <div>
                  <div className="mstep-ttl">Ship the system.</div>
                  <div className="mstep-desc">
                    Custom code on your stack, in your language. Weekly demos. No moving targets. You see the agent on your data by week two.
                  </div>
                </div>
                <div className="mstep-deliv">
                  <div className="k">Deliverables</div>
                  <ul>
                    <li>Working prototype (wk 2)</li>
                    <li>Production build (wk 5)</li>
                    <li>Runbook &amp; tests</li>
                  </ul>
                </div>
              </article>
              <article className="mstep">
                <div className="mstep-n"><span>03 · Hand over</span><span className="wk">wk 6+</span></div>
                <div>
                  <div className="mstep-ttl">Yours, fully.</div>
                  <div className="mstep-desc">
                    Full source, infra scripts, training materials. We stay on retainer to tune and scale — or we don&apos;t. Your call. No lock-in.
                  </div>
                </div>
                <div className="mstep-deliv">
                  <div className="k">Deliverables</div>
                  <ul>
                    <li>Source + infra</li>
                    <li>Team training (2 sessions)</li>
                    <li>Optional retainer</li>
                  </ul>
                </div>
              </article>
            </div>
          </section>

          {/* §H Hardware */}
          <section id="hardware">
            <div className="sect-head">
              <div className="sect-id">
                <span className="glyph">§</span><span className="n">H</span><span className="glyph">/</span><span>Hardware is the ceiling</span>
              </div>
              <div className="sect-rule" />
              <div className="sect-meta">on-prem · no egress</div>
            </div>
            <div className="hw">
              <div className="hw-copy">
                <h2>Scale by adding <span className="em">GPUs</span>, not subscriptions.</h2>
                <p>
                  Your agents run on your hardware. One box does four. A rack does forty. Two racks do four hundred. Your data never leaves your network — and your cost curve is a line, not a subscription.
                </p>
                <div className="quote">
                  We don&apos;t charge per-seat. We don&apos;t charge per-token. You pay us once to build it, and then you pay your electricity bill.
                </div>
              </div>
              <div className="hw-schem">
                <div className="hw-schem-head">
                  <span className="dot" />
                  <span className="ttl">capacity · measured</span>
                  <span className="trail">Llama 3.3 70B · Q4_K_M</span>
                </div>
                <div className="hw-schem-cols">
                  <div>Hardware</div>
                  <div>Agents</div>
                  <div>Throughput</div>
                  <div className="hide">Latency</div>
                  <div>Egress</div>
                </div>

                <HwRow chip="4090"   meta="24GB · 1×"      agents="~4"   tps="30"    lat="920" />
                <HwRow chip="H100"   meta="80GB · 1×"      agents="~40"  tps="180"   lat="420" />
                <HwRow chip="H100×8" meta="640GB · 1 node" agents="~400" tps="1,800" lat="380" />

                <div className="hw-schem-foot">
                  <span>CLOUD</span><span className="sp">·</span>
                  <span>ON-PREM</span><span className="sp">·</span>
                  <span className="on">HYBRID</span><span className="sp">·</span>
                  <span>AIR-GAPPED</span>
                </div>
              </div>
            </div>
          </section>

          {/* §I Industries */}
          <section id="industries">
            <div className="sect-head">
              <div className="sect-id">
                <span className="glyph">§</span><span className="n">I</span><span className="glyph">/</span><span>Industries</span>
              </div>
              <div className="sect-rule" />
              <div className="sect-meta">who we build for</div>
            </div>
            <div className="sect-intro">
              <h2>Every industry.<br /><span className="muted">One connected approach.</span></h2>
            </div>
            <div className="ind-row">
              <div className="ind-scroll">
                {[
                  "Restaurants & Hospitality",
                  "Legal & Compliance",
                  "Marketing & Creative",
                  "E-commerce & Retail",
                  "Healthcare & Clinics",
                  "HR & Recruitment",
                  "Finance & Accounting",
                  "Real Estate",
                  "Education & Training",
                  "Logistics & Supply",
                  "Manufacturing",
                ].map((label, i) => (
                  <span key={label} className={`pill${i === 5 ? " on" : ""}`}>{label}</span>
                ))}
              </div>
            </div>
            <div className="ind-count">11 sectors shipped · 6 in flight</div>
          </section>

          {/* §W Why */}
          <section id="why">
            <div className="sect-head">
              <div className="sect-id">
                <span className="glyph">§</span><span className="n">W</span><span className="glyph">/</span><span>Why Ai2B</span>
              </div>
              <div className="sect-rule" />
              <div className="sect-meta">the short version</div>
            </div>
            <div className="why">
              <div className="why-l">
                <h2>Most teams don&apos;t need another chatbot. They need a system <span className="em">built for them.</span></h2>
                <p>
                  Engineers, designers and strategists. Based in Barcelona, working EU-wide. Our edge: we actually ship.
                </p>
              </div>
              <div className="why-r">
                <div className="why-list">
                  <WhyItem n="01" title="No generic tools." tag="Custom">
                    Every system is shaped around your workflows, your data, your language. We don&apos;t retrofit a template onto your business.
                  </WhyItem>
                  <WhyItem n="02" title="Multilingual by default." tag="ES · PT · EN">
                    Spanish, Portuguese and English out of the gate. Agents read and write in the language your team already uses.
                  </WhyItem>
                  <WhyItem n="03" title="Fast to ship." tag="2 → 6 wks">
                    Prototype in 2 weeks. Production in 4–6. We don&apos;t do quarterly roadmaps — we do weekly demos.
                  </WhyItem>
                  <WhyItem n="04" title="You own the code." tag="100% handover">
                    Full source, infra scripts, training materials. You can fire us the day after we ship. No vendor lock-in. Ever.
                  </WhyItem>
                  <WhyItem n="05" title="On-prem if you want it." tag="0 bytes egress">
                    Your data never leaves your network. Local LLMs, your hardware, your rules. No egress, no vendor API, no leaks.
                  </WhyItem>
                </div>
              </div>
            </div>
          </section>

          {/* §C Contact */}
          <section id="contact">
            <div className="sect-head">
              <div className="sect-id">
                <span className="glyph">§</span><span className="n">C</span><span className="glyph">/</span><span>Contact</span>
              </div>
              <div className="sect-rule" />
              <div className="sect-meta">response · within 24h</div>
            </div>
            <div className="contact">
              <div className="contact-l">
                <h2>Tell us what&apos;s <span className="em">slow.</span></h2>
                <p>
                  Point at the workflow that&apos;s costing your team hours. We&apos;ll send back a short note on whether AI is the right fix — or whether it isn&apos;t. No pitch decks. No calendar tennis.
                </p>
                <div className="contact-rows">
                  <div className="r"><span className="k">Email</span><span className="v">hello@ai2b.io</span></div>
                  <div className="r"><span className="k">Office</span><span className="v">Barcelona · working EU-wide</span></div>
                  <div className="r"><span className="k">Response</span><span className="v">Within 24 hours · founder replies</span></div>
                  <div className="r"><span className="k">Capacity</span><span className="v">3 of 5 Q2 slots booked</span></div>
                </div>
              </div>
              <div className="term">
                <div className="term-head">
                  <span className="dot" />
                  <span className="ttl">new_project · intake</span>
                  <span className="trail">field 01 / 04</span>
                </div>
                <form
                  className="term-body"
                  onSubmit={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLFormElement).reset();
                    alert("Demo form — thanks!");
                  }}
                >
                  <div className="term-field">
                    <span className="k">from</span>
                    <input className="term-input" type="text" placeholder="your name" required />
                  </div>
                  <div className="term-field">
                    <span className="k">email</span>
                    <input className="term-input" type="email" placeholder="you@company.com" required />
                  </div>
                  <div className="term-field">
                    <span className="k">company</span>
                    <input className="term-input" type="text" placeholder="restaurant group · law firm · e-commerce ·…" />
                  </div>
                  <div className="term-field">
                    <span className="k">slow</span>
                    <textarea className="term-area" placeholder="which workflow is costing your team the most hours?" />
                  </div>
                  <div className="term-submit">
                    <span className="term-hint">No NDA needed. We reply before we sign.</span>
                    <button type="submit" className="btn primary">Send <ArrowOut /></button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>

        <footer className="foot">
          <div className="foot-top">
            <div className="foot-brand">
              <div className="bm"><span className="mark" /><span className="wm">Ai2B</span></div>
              <p className="tag">
                Custom AI agent systems for businesses that actually ship. Barcelona · EU-wide · Est. 2024.
              </p>
            </div>
            <div className="foot-col">
              <div className="h">System</div>
              <a href="#method">Method</a>
              <a href="#hardware">Hardware</a>
              <a href="#industries">Industries</a>
            </div>
            <div className="foot-col">
              <div className="h">Studio</div>
              <a href="#why">Why Ai2B</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="foot-col">
              <div className="h">Elsewhere</div>
              <a href="mailto:hello@ai2b.io">hello@ai2b.io</a>
              <a href="#">LinkedIn ↗</a>
              <a href="#">GitHub ↗</a>
            </div>
          </div>
          <div className="foot-bar">
            <span>© 2026 Ai2B S.L. · Barcelona</span>
            <span className="sp">·</span>
            <span>v26.4 · scroll {(pct * 100).toFixed(1)}%</span>
            <span style={{ marginLeft: "auto" }}>Partnering with 3 teams · Q2 2026</span>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ─── helpers ─── */

function AgentPanel({
  on, agent, title, lede, bullets,
}: {
  on: boolean;
  agent: AgentKey;
  title: React.ReactNode;
  lede: string;
  bullets: string[];
}) {
  const a = AGENTS[agent];
  return (
    <div className={`panel pa${on ? " on" : ""}`}>
      <div className="agent-tag" style={{ color: a.color }}>
        <span className="dot" style={{ background: a.color }} />
        {a.tag}
      </div>
      <h3>{title}</h3>
      <p className="lede">{lede}</p>
      <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
    </div>
  );
}

function Telemetry({
  on, agent, status, rows,
}: {
  on: boolean;
  agent: AgentKey;
  status: string;
  rows: [string, string, string][];
}) {
  const a = AGENTS[agent];
  return (
    <div className={`telem panel${on ? " on" : ""}`}>
      <div className="head">
        <span>{agent.toUpperCase()}_AGENT.LIVE</span>
        <span style={{ color: a.color }}>● {status}</span>
      </div>
      {rows.map(([k, w, v]) => (
        <div className="row" key={k}>
          <span className="k">{k}</span>
          <div className="bar"><i data-w={w} style={{ background: a.color }} /></div>
          <span className="v">{v}</span>
        </div>
      ))}
    </div>
  );
}

function HwRow({
  chip, meta, agents, tps, lat,
}: {
  chip: string; meta: string; agents: string; tps: string; lat: string;
}) {
  return (
    <div className="hw-row">
      <div className="hw-card">
        <div className="chip">{chip}</div>
        <div className="meta">{meta}</div>
      </div>
      <div className="hw-cell"><span className="k">Agents</span><span className="v">{agents}</span></div>
      <div className="hw-cell"><span className="k">Tok/s</span><span className="v">{tps}<span className="u">tok/s</span></span></div>
      <div className="hw-cell hide"><span className="k">Lat p95</span><span className="v">{lat}<span className="u">ms</span></span></div>
      <div className="hw-cell on"><span className="k">Egress</span><span className="v">0<span className="u">bytes</span></span></div>
    </div>
  );
}

function WhyItem({
  n, title, tag, children,
}: {
  n: string; title: string; tag: string; children: React.ReactNode;
}) {
  return (
    <div className="why-item">
      <span className="n">{n}</span>
      <div>
        <div className="ttl">{title}</div>
        <p>{children}</p>
      </div>
      <span className="tag">{tag}</span>
    </div>
  );
}
