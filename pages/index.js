
"use client";
import React, { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import { Leaf, Factory, Coins, ShieldCheck, BarChart3, Timer, FileText, Mail, Phone } from "lucide-react";
import { Card, Section, Stat, PillButton, Collapse } from "@/components/ui";

const SITE = {
  title: "Buswell Biochar – Investor Proposal",
  subtitle: "High‑integrity carbon removals from a regenerative farm in Oxfordshire, UK",
  contactEmail: "tombuswell80@gmail.com",
  pdfUrl: "/Biochar_Carbon_Sequestration_Business_Plan_Full.pdf",
  baseUrl: "https://example.com"
};

const FINANCIALS = {
  CAPEX: 2925000,
  OPEX: 255000,
  TCO2: 1760,
  ramp: [0.6, 0.85, 1, 1, 1, 1, 1, 1, 1, 1],
  scenarios: [
    { key: "conservative", label: "Conservative", price: 150 },
    { key: "base", label: "Base case", price: 200 },
    { key: "optimistic", label: "Optimistic", price: 250 },
  ],
};

function useScenarioData(pricePerT) {
  const { TCO2, OPEX, CAPEX, ramp } = FINANCIALS;
  return useMemo(() => {
    const years = Array.from({ length: 10 }).map((_, i) => i + 1);
    const rows = years.map((year, i) => {
      const factor = ramp[i] ?? 1;
      const revenue = pricePerT * TCO2 * factor;
      const opex = OPEX;
      const margin = revenue - opex;
      return { year, revenue, opex, margin };
    });
    let cum = -CAPEX;
    const cumSeries = rows.map((r) => { cum += r.margin; return { year: r.year, cumulative: cum }; });
    return { rows, cumSeries };
  }, [pricePerT]);
}

function FormRow({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="text-zinc-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

async function submitForm(endpoint, data, onStatus) {
  try {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await res.json();
    onStatus(j);
  } catch (e) {
    onStatus({ ok: false, error: e?.message || "Network error" });
  }
}

export default function Home() {
  const [scenarioKey, setScenarioKey] = useState("base");
  const scenarioDefault = FINANCIALS.scenarios.find((s) => s.key === scenarioKey) || FINANCIALS.scenarios[1];
  const [price, setPrice] = useState(scenarioDefault.price);
  useEffect(() => setPrice(scenarioDefault.price), [scenarioKey]);

  const { rows, cumSeries } = useScenarioData(price);
  const paybackYear = useMemo(() => {
    let cum = -FINANCIALS.CAPEX;
    for (const r of rows) { cum += r.margin; if (cum >= 0) return r.year; }
    return null;
  }, [rows]);

  // Contact form state
  const [cName, setCName] = useState(""); const [cEmail, setCEmail] = useState(""); const [cCompany, setCCompany] = useState(""); const [cMsg, setCMsg] = useState("");
  const [cStatus, setCStatus] = useState(null); const [cHP, setCHP] = useState("");

  // Data room form state
  const [dName, setDName] = useState(""); const [dEmail, setDEmail] = useState(""); const [dCompany, setDCompany] = useState(""); const [dMsg, setDMsg] = useState("");
  const [dStatus, setDStatus] = useState(null); const [dHP, setDHP] = useState("");

  return (
    <div className="min-h-screen">
      <Head>
        <title>Buswell Biochar — Investor Proposal</title>
        <meta name="description" content="Certified biochar carbon removals from a third-generation Oxfordshire farm. Investor-ready with interactive financials and contact/data room access." />
        <meta property="og:title" content="Buswell Biochar — Investor Proposal" />
        <meta property="og:description" content="Certified biochar carbon removals from a third-generation Oxfordshire farm." />
        <meta property="og:image" content="/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={SITE.baseUrl} />
      </Head>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight">
            {SITE.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 md:mt-4 text-lg md:text-xl text-zinc-700 max-w-3xl">
            {SITE.subtitle}
          </motion.p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Leaf} label="Annual removals" value="~1,760 tCO₂e" sub="EBC C‑Sink eligible" />
            <Stat icon={Factory} label="Plant capex" value="£2.93m" sub="Containerised slow‑pyrolysis" />
            <Stat icon={Coins} label="Annual opex" value="£255k" sub="1.5 FTE + MRV + power" />
            <Stat icon={ShieldCheck} label="Standards" value="EBC C‑Sink / MRV" sub="Puro.earth or Carbonfuture" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${SITE.contactEmail}`} className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-5 py-3 text-sm shadow hover:bg-zinc-800">
              <Mail className="h-4 w-4" /> Request a meeting
            </a>
            <a href={SITE.pdfUrl} className="inline-flex items-center gap-2 rounded-full bg-white border px-5 py-3 text-sm shadow-sm hover:bg-zinc-50" target="_blank" rel="noreferrer">
              <FileText className="h-4 w-4" /> Download full plan (PDF)
            </a>
          </div>
        </div>
      </header>

      {/* OPPORTUNITY */}
      <Section id="opportunity" title="The Opportunity" kicker="Why now & why here">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h3 className="font-semibold mb-2">Why now</h3>
            <p className="text-sm text-zinc-700 leading-6">Durable carbon removals are supply-constrained. Biochar leads delivered CDR volumes and earns premium pricing with credible MRV. Policy tailwinds (UK ETS explorations, EU CRCF in force) are reducing buyer risk.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Why here</h3>
            <p className="text-sm text-zinc-700 leading-6">On-farm siting in Oxfordshire within a tight logistics radius. Trusted land stewardship, access to clean woody feedstocks, and diversified soil/material sinks enable defensible, scalable supply.</p>
          </Card>
        </div>
      </Section>

      {/* FINANCIALS */}
      <Section id="financials" title="Financial Model & ROI" kicker="Interactive">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {FINANCIALS.scenarios.map((s) => (
                  <PillButton key={s.key} active={scenarioKey === s.key} onClick={() => setScenarioKey(s.key)}>
                    {s.label}
                  </PillButton>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-600">Credit price (£/tCO₂e)</span>
                <input type="range" min={120} max={300} step={5} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <span className="text-sm font-medium">£{price}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="text-xs text-zinc-500">Annual revenue</div>
                <div className="text-xl font-semibold">£{(price * FINANCIALS.TCO2).toLocaleString()}</div>
                <div className="text-xs text-zinc-500">steady‑state (pre‑ramp)</div>
              </Card>
              <Card>
                <div className="text-xs text-zinc-500">Annual margin</div>
                <div className="text-xl font-semibold">£{(price * FINANCIALS.TCO2 - FINANCIALS.OPEX).toLocaleString()}</div>
                <div className="text-xs text-zinc-500">revenue − opex</div>
              </Card>
              <Card>
                <div className="text-xs text-zinc-500">Payback (est.)</div>
                <div className="text-xl font-semibold">{paybackYear ? `${paybackYear} yrs` : "> 10 yrs"}</div>
                <div className="text-xs text-zinc-500">with production ramp</div>
              </Card>
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="opx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} />
                  <YAxis tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`£${Number(v).toLocaleString()}`, "£/yr"]} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" fill="url(#rev)" />
                  <Area type="monotone" dataKey="opex" name="Opex" stroke="#a78bfa" fill="url(#opx)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows.map((r, i) => {
                  let cum = -FINANCIALS.CAPEX;
                  for (let j = 0; j <= i; j++) cum += rows[j].margin;
                  return { year: r.year, cumulative: cum };
                })} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} />
                  <YAxis tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`£${Number(v).toLocaleString()}`, "Cumulative"]} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" name="Cumulative cashflow" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Assumptions</h3>
            <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-4">
              <li>Throughput: 2,000 t/yr dry feedstock → ~600 t/yr biochar.</li>
              <li>Verified removals: ~1,760 tCO₂e/yr (steady‑state).</li>
              <li>Opex: £255k/yr; Capex: £2.925m (containerised line + civils).</li>
              <li>Ramp: 60% (Y1), 85% (Y2), 100% thereafter.</li>
              <li>Price band: £150–£250/tCO₂e (adjustable).</li>
              <li>Revenue from CORCs; optional biochar/heat sales = upside.</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* TECH & OPS */}
      <Section id="tech" title="Technology & Operations" kicker="How it works">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card>
            <h3 className="font-semibold mb-2">Plant</h3>
            <p className="text-sm text-zinc-700 leading-6">Containerised slow‑pyrolysis with emissions abatement, automated feed, and waste‑heat recovery for drying. Designed to meet EBC Quality and C‑Sink thresholds (e.g., H/Corg &lt; 0.7).</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Feedstock</h3>
            <p className="text-sm text-zinc-700 leading-6">Local Grade A/B wood waste, estate thinnings, on‑farm hedgerow arisings, plus herbaceous blends (straw/leys) with moisture control and screening for stable, certifiable char.</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Sinks & MRV</h3>
            <p className="text-sm text-zinc-700 leading-6">Soil sinks on‑farm and with neighbours, plus material sinks documented with GPS, batch logs and independent labs; issuance via Puro.earth/Carbonfuture.</p>
          </Card>
        </div>
      </Section>

      {/* RISK */}
      <Section id="risk" title="Risks & Mitigations" kicker="Downside protection">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Risk</th>
                <th className="py-2">Impact</th>
                <th className="py-2">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-3">Feedstock shortfall/quality</td><td className="py-3">High</td><td className="py-3">Multi‑year contracts; moisture & size specs; on‑site pre‑drying; QA sampling.</td></tr>
              <tr><td className="py-3">Price volatility</td><td className="py-3">Medium</td><td className="py-3">Forward offtakes; diversified sinks; optional biochar/heat sales.</td></tr>
              <tr><td className="py-3">Permit delays</td><td className="py-3">Medium</td><td className="py-3">EA pre‑app; experienced consultant; phased feedstock list.</td></tr>
              <tr><td className="py-3">Equipment downtime</td><td className="py-3">Medium</td><td className="py-3">OEM service plan; critical spares; trained operator coverage.</td></tr>
              <tr><td className="py-3">MRV non‑compliance</td><td className="py-3">High</td><td className="py-3">EBC pre‑audit; regimented sampling; data logs; platform QA.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ROADMAP, CONTACT, DATAROOM */}
      <Section id="roadmap" title="Implementation Roadmap" kicker="0–24 months">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { phase: "0–2 months", items: ["Lock feedstock MOUs (arborists, estates, straw)", "Engage MRV partner; EA pre‑app"] },
            { phase: "3–6 months", items: ["Planning & permit submission", "OEM shortlist and due diligence", "Finance close (grants/green loan/partner)"] },
            { phase: "7–12 months", items: ["Civils & utilities; covered bays", "Equipment delivery & installation", "Commissioning & trial batches"] },
            { phase: "13–24 months", items: ["EBC audit; MRV onboarding", "First issuance & sales; ramp to nameplate", "Scale: second line / heat use / material sinks"] },
          ].map((col, idx) => (
            <Card key={idx}>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Timer className="h-5 w-5" /> {col.phase}</h4>
              <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
                {col.items.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Contact & Data Room" kicker="Let’s talk">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact form */}
          <Card>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Mail className="h-5 w-5" /> Request a meeting</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitForm('/api/contact', { name: cName, email: cEmail, company: cCompany, message: cMsg, honey: cHP }, setCStatus); }} className="space-y-3">
              <input type="text" value={cHP} onChange={(e)=>setCHP(e.target.value)} className="hidden" aria-hidden="true" tabIndex={-1} />
              <FormRow label="Name"><input required value={cName} onChange={(e)=>setCName(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Email"><input required type="email" value={cEmail} onChange={(e)=>setCEmail(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Company (optional)"><input value={cCompany} onChange={(e)=>setCCompany(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Message"><textarea required value={cMsg} onChange={(e)=>setCMsg(e.target.value)} rows={4} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <div className="flex items-center gap-3">
                <button className="rounded-md bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-zinc-800">Send</button>
                <a href={`mailto:${SITE.contactEmail}`} className="inline-flex items-center gap-2 text-sm underline"><Phone className="h-4 w-4" /> or email us</a>
              </div>
              {cStatus && !cStatus.ok && cStatus.mailto && (
                <p className="text-sm text-amber-700 mt-2">Email service not configured — message not sent. Click the “email us” link or configure SMTP env vars.</p>
              )}
              {cStatus && cStatus.ok && (<p className="text-sm text-emerald-700 mt-2">Thanks — we’ve received your message.</p>)}
              {cStatus && !cStatus.ok && !cStatus.mailto && (<p className="text-sm text-red-700 mt-2">Error: {cStatus.error}</p>)}
            </form>
          </Card>

          {/* Data room */}
          <Card>
            <h3 className="font-semibold mb-2">Request data room access</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitForm('/api/dataroom', { name: dName, email: dEmail, company: dCompany, message: dMsg, honey: dHP }, setDStatus); }} className="space-y-3">
              <input type="text" value={dHP} onChange={(e)=>setDHP(e.target.value)} className="hidden" aria-hidden="true" tabIndex={-1} />
              <FormRow label="Name"><input required value={dName} onChange={(e)=>setDName(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Email"><input required type="email" value={dEmail} onChange={(e)=>setDEmail(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Company"><input required value={dCompany} onChange={(e)=>setDCompany(e.target.value)} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <FormRow label="Intended use / questions"><textarea required value={dMsg} onChange={(e)=>setDMsg(e.target.value)} rows={4} className="w-full border rounded-md px-3 py-2" /></FormRow>
              <div className="flex items-center gap-3">
                <button className="rounded-md bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-zinc-800">Request access</button>
                <a href={SITE.pdfUrl} target="_blank" rel="noreferrer" className="text-sm underline">Download the public plan (PDF)</a>
              </div>
              {dStatus && !dStatus.ok && dStatus.mailto && (
                <p className="text-sm text-amber-700 mt-2">Email service not configured — please email <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
              )}
              {dStatus && dStatus.ok && (<p className="text-sm text-emerald-700 mt-2">Thanks — we’ll be in touch with access details.</p>)}
              {dStatus && !dStatus.ok && !dStatus.mailto && (<p className="text-sm text-red-700 mt-2">Error: {dStatus.error}</p>)}
            </form>
          </Card>
        </div>
      </Section>

      <footer className="py-8 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Buswell Partnership • Oxfordshire, UK</footer>
    </div>
  );
}
